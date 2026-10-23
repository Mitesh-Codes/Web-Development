import mongoose from "mongoose";
import fs from "fs";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { Comment } from "../models/comment.models.js";
import { Like } from "../models/like.models.js";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  getCloudinaryAssetFromUrl,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc" } = req.query;
  const userId = req.params.userId || req.query.userId;
  const safePage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 10, 1), 100);
  const filter = { isPublished: true };

  if (query !== undefined) {
    if (typeof query !== "string") throw new ApiError(400, "Search query must be a string");
    const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (escapedQuery) filter.title = { $regex: escapedQuery, $options: "i" };
  }
  if (userId) {
    if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid user id");
    filter.owner = userId;
  }

  const allowedSortFields = ["createdAt", "views", "title", "duration"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortDirection = String(sortType).toLowerCase() === "asc" ? 1 : -1;
  const [videos, totalVideos] = await Promise.all([
    Video.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .populate("owner", "username fullName avatar"),
    Video.countDocuments(filter),
  ]);

  return res.status(200).json(new ApiResponse(200, {
    videos,
    page: safePage,
    limit: safeLimit,
    totalVideos,
    totalPages: Math.ceil(totalVideos / safeLimit),
  }, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  const { title, description } = req.body || {};

  if (!videoLocalPath || !fs.existsSync(videoLocalPath)) throw new ApiError(400, "Video file was not received");
  if (!thumbnailLocalPath || !fs.existsSync(thumbnailLocalPath)) throw new ApiError(400, "Thumbnail file was not received");
  if (typeof title !== "string" || !title.trim() || typeof description !== "string" || !description.trim()) {
    throw new ApiError(400, "Title and description are required");
  }

  let videoFile;
  try {
    videoFile = await uploadOnCloudinary(videoLocalPath);
  } catch {
    throw new ApiError(500, "Could not upload video file");
  }
  if (!videoFile?.secure_url) throw new ApiError(500, "Could not upload video file");

  let thumbnail;
  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  } catch {
    await deleteFromCloudinary(videoFile.public_id, "video");
    throw new ApiError(500, "Could not upload thumbnail");
  }
  if (!thumbnail?.secure_url) {
    await deleteFromCloudinary(videoFile.public_id, "video");
    throw new ApiError(500, "Could not upload thumbnail");
  }

  let video;
  try {
    video = await Video.create({
      videoFile: videoFile.secure_url,
      videoFilePublicId: videoFile.public_id,
      thumbnail: thumbnail.secure_url,
      thumbnailPublicId: thumbnail.public_id,
      title: title.trim(),
      description: description.trim(),
      duration: videoFile.duration || 0,
      owner: req.user._id,
    });
  } catch (error) {
    await Promise.all([
      deleteFromCloudinary(videoFile.public_id, "video"),
      deleteFromCloudinary(thumbnail.public_id),
    ]);
    throw error;
  }
  return res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");

  const video = await Video.findOneAndUpdate(
    { _id: videoId, $or: [{ isPublished: true }, { owner: req.user?._id }] },
    { $inc: { views: 1 } },
    { new: true },
  ).populate("owner", "username fullName avatar");
  if (!video) throw new ApiError(404, "Video not found");

  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { watchHistory: video._id } });
  }
  return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body || {};
  if (!mongoose.isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");

  const updates = {};
  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) throw new ApiError(400, "Title cannot be empty");
    updates.title = title.trim();
  }
  if (description !== undefined) {
    if (typeof description !== "string" || !description.trim()) throw new ApiError(400, "Description cannot be empty");
    updates.description = description.trim();
  }
  const existingVideo = await Video.findById(videoId).select("+thumbnailPublicId");
  if (!existingVideo) throw new ApiError(404, "Video not found");
  if (!existingVideo.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not allowed to update this video");
  }

  const thumbnailPath = req.file?.path || req.files?.thumbnail?.[0]?.path;
  let uploadedThumbnail;
  if (thumbnailPath) {
    if (!fs.existsSync(thumbnailPath)) throw new ApiError(400, "Thumbnail file was not received");
    try {
      uploadedThumbnail = await uploadOnCloudinary(thumbnailPath);
    } catch {
      throw new ApiError(500, "Could not upload thumbnail");
    }
    if (!uploadedThumbnail?.secure_url) throw new ApiError(500, "Could not upload thumbnail");
    updates.thumbnail = uploadedThumbnail.secure_url;
    updates.thumbnailPublicId = uploadedThumbnail.public_id;
  }
  if (!Object.keys(updates).length) throw new ApiError(400, "Provide a title, description, or thumbnail to update");

  let video;
  try {
    video = await Video.findOneAndUpdate(
      { _id: videoId, owner: req.user._id }, updates, { new: true, runValidators: true },
    );
  } catch (error) {
    if (uploadedThumbnail?.public_id) await deleteFromCloudinary(uploadedThumbnail.public_id);
    throw error;
  }
  if (!video) {
    if (uploadedThumbnail?.public_id) await deleteFromCloudinary(uploadedThumbnail.public_id);
    throw new ApiError(404, "Video not found");
  }
  const previousThumbnail = getCloudinaryAssetFromUrl(existingVideo.thumbnail);
  const previousThumbnailPublicId = existingVideo.thumbnailPublicId || previousThumbnail?.publicId;
  if (uploadedThumbnail?.public_id && previousThumbnailPublicId) {
    await deleteFromCloudinary(previousThumbnailPublicId, previousThumbnail?.resourceType || "image");
  }
  return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");

  const video = await Video.findOneAndDelete({ _id: videoId, owner: req.user._id })
    .select("+videoFilePublicId +thumbnailPublicId");
  if (!video) {
    if (!(await Video.exists({ _id: videoId }))) throw new ApiError(404, "Video not found");
    throw new ApiError(403, "You are not allowed to delete this video");
  }
  const videoAsset = getCloudinaryAssetFromUrl(video.videoFile);
  const thumbnailAsset = getCloudinaryAssetFromUrl(video.thumbnail);
  await Promise.all([
    Comment.deleteMany({ video: video._id }),
    Like.deleteMany({ video: video._id }),
    Playlist.updateMany({ videos: video._id }, { $pull: { videos: video._id } }),
    deleteFromCloudinary(video.videoFilePublicId || videoAsset?.publicId, videoAsset?.resourceType || "video"),
    deleteFromCloudinary(video.thumbnailPublicId || thumbnailAsset?.publicId, thumbnailAsset?.resourceType || "image"),
  ]);
  return res.status(200).json(new ApiResponse(200, video, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");
  const video = await Video.findOne({ _id: videoId, owner: req.user._id });
  if (!video) throw new ApiError(404, "Video not found");
  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, video, "Video publish status updated"));
});

export { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus };
