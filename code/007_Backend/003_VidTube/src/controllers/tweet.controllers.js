import mongoose from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid user id");
  if (!(await User.exists({ _id: userId }))) throw new ApiError(404, "User not found");
  const tweets = await Tweet.find({ owner: userId })
    .sort({ createdAt: -1 })
    .populate("owner", "username fullName avatar");
  return res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

const createTweet = asyncHandler(async (req, res) => {
  const content = req.body?.content;
  if (typeof content !== "string" || !content.trim()) throw new ApiError(400, "Tweet content is required");
  const tweet = await Tweet.create({ content: content.trim(), owner: req.user._id });
  return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const content = req.body?.content;
  if (!mongoose.isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet id");
  if (typeof content !== "string" || !content.trim()) throw new ApiError(400, "Tweet content is required");
  const tweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, owner: req.user._id }, { $set: { content: content.trim() } }, { new: true, runValidators: true },
  );
  if (!tweet) {
    if (!(await Tweet.exists({ _id: tweetId }))) throw new ApiError(404, "Tweet not found");
    throw new ApiError(403, "You are not allowed to update this tweet");
  }
  return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!mongoose.isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet id");
  const tweet = await Tweet.findOneAndDelete({ _id: tweetId, owner: req.user._id });
  if (!tweet) {
    if (!(await Tweet.exists({ _id: tweetId }))) throw new ApiError(404, "Tweet not found");
    throw new ApiError(403, "You are not allowed to delete this tweet");
  }
  await Like.deleteMany({ tweet: tweet._id });
  return res.status(200).json(new ApiResponse(200, tweet, "Tweet deleted successfully"));
});

export { getUserTweets, createTweet, updateTweet, deleteTweet };
