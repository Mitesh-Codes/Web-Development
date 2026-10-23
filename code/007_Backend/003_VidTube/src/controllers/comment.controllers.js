import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { Like } from "../models/like.models.js";

const parsePaginationValue = (value, fallback, maximum = Number.MAX_SAFE_INTEGER) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0
    ? Math.min(parsed, maximum)
    : fallback;
};

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (!video.isPublished && String(video.owner) !== String(req.user._id)) {
    throw new ApiError(404, "Video not found");
  }

  const paginationOptions = {
    page: parsePaginationValue(page, 1),
    limit: parsePaginationValue(limit, 10, 100),
  };
  const comments = await Comment.aggregatePaginate(
    Comment.aggregate([
      { $match: { video: new mongoose.Types.ObjectId(videoId) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }],
        },
      },
      { $unwind: "$owner" },
    ]),
    paginationOptions,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Video comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const content = req.body?.content;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }
  if (typeof content !== "string" || !content.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (!video.isPublished && String(video.owner) !== String(req.user._id)) {
    throw new ApiError(404, "Video not found");
  }

  const comment = await Comment.create({
    content: content.trim(),
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const content = req.body?.content;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }
  if (typeof content !== "string" || !content.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, owner: req.user._id },
    { $set: { content: content.trim() } },
    { new: true, runValidators: true },
  );
  if (!comment) {
    const existingComment = await Comment.exists({ _id: commentId });
    if (!existingComment) {
      throw new ApiError(404, "Comment not found");
    }
    throw new ApiError(403, "You are not allowed to update this comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    owner: req.user._id,
  });
  if (!comment) {
    const existingComment = await Comment.exists({ _id: commentId });
    if (!existingComment) {
      throw new ApiError(404, "Comment not found");
    }
    throw new ApiError(403, "You are not allowed to delete this comment");
  }
  await Like.deleteMany({ comment: comment._id });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
