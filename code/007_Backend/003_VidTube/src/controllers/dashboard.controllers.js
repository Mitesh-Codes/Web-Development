import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized");
  const channelId = new mongoose.Types.ObjectId(req.user._id);
  const [videoStats, subscribersCount, videoIds] = await Promise.all([
    Video.aggregate([
      { $match: { owner: channelId } },
      { $group: { _id: null, totalVideos: { $sum: 1 }, totalViews: { $sum: "$views" } } },
    ]),
    Subscription.countDocuments({ channel: channelId }),
    Video.find({ owner: channelId }).distinct("_id"),
  ]);
  const totalLikes = videoIds.length
    ? await Like.countDocuments({ video: { $in: videoIds } })
    : 0;
  const stats = {
    totalVideos: videoStats[0]?.totalVideos || 0,
    totalViews: videoStats[0]?.totalViews || 0,
    totalSubscribers: subscribersCount,
    totalLikes,
  };
  return res.status(200).json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized");
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
  const [videos, totalVideos] = await Promise.all([
    Video.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Video.countDocuments({ owner: req.user._id }),
  ]);
  return res.status(200).json(new ApiResponse(200, {
    videos,
    page,
    limit,
    totalVideos,
    totalPages: Math.ceil(totalVideos / limit),
  }, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
