import mongoose from "mongoose";
import { Like } from "../models/like.models.js";
import { Video } from "../models/video.models.js";
import { Comment } from "../models/comment.models.js";
import { Tweet } from "../models/tweet.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");
  const video = await Video.findById(videoId);
  if (!video || (!video.isPublished && String(video.owner) !== String(req.user._id))) {
    throw new ApiError(404, "Video not found");
  }

  const filter = { video: videoId, likedBy: req.user._id };
  const existingLike = await Like.findOne(filter);
  if (existingLike) {
    await existingLike.deleteOne();
    return res.status(200).json(new ApiResponse(200, { liked: false }, "Video like removed"));
  }

  let like;
  try {
    like = await Like.create(filter);
  } catch (error) {
    if (error?.code !== 11000) throw error;
    return res.status(200).json(new ApiResponse(200, { liked: true }, "Video already liked"));
  }
  return res.status(201).json(new ApiResponse(201, { liked: true, like }, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) throw new ApiError(400, "Invalid comment id");
  const comment = await Comment.findById(commentId).populate("video", "owner isPublished");
  if (!comment) throw new ApiError(404, "Comment not found");
  if (
    comment.video && !comment.video.isPublished &&
    String(comment.video.owner) !== String(req.user._id)
  ) {
    throw new ApiError(404, "Comment not found");
  }

  const filter = { comment: commentId, likedBy: req.user._id };
  const existingLike = await Like.findOne(filter);
  if (existingLike) {
    await existingLike.deleteOne();
    return res.status(200).json(new ApiResponse(200, { liked: false }, "Comment like removed"));
  }

  let like;
  try {
    like = await Like.create(filter);
  } catch (error) {
    if (error?.code !== 11000) throw error;
    return res.status(200).json(new ApiResponse(200, { liked: true }, "Comment already liked"));
  }
  return res.status(201).json(new ApiResponse(201, { liked: true, like }, "Comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!mongoose.isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet id");
  if (!(await Tweet.exists({ _id: tweetId }))) throw new ApiError(404, "Tweet not found");

  const filter = { tweet: tweetId, likedBy: req.user._id };
  const existingLike = await Like.findOne(filter);
  if (existingLike) {
    await existingLike.deleteOne();
    return res.status(200).json(new ApiResponse(200, { liked: false }, "Tweet like removed"));
  }

  let like;
  try {
    like = await Like.create(filter);
  } catch (error) {
    if (error?.code !== 11000) throw error;
    return res.status(200).json(new ApiResponse(200, { liked: true }, "Tweet already liked"));
  }
  return res.status(201).json(new ApiResponse(201, { liked: true, like }, "Tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likes = await Like.find({ likedBy: req.user._id, video: { $ne: null } })
    .sort({ createdAt: -1 })
    .populate({
      path: "video",
      match: { isPublished: true },
      populate: { path: "owner", select: "username fullName avatar" },
    });
  const videos = likes.map((like) => like.video).filter(Boolean);
  return res.status(200).json(new ApiResponse(200, videos, "Liked videos fetched successfully"));
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
