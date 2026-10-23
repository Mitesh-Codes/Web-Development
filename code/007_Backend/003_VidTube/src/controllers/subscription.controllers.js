import mongoose from "mongoose";
import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriber = req.user._id;
  if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel id");
  if (String(channelId) === String(subscriber)) throw new ApiError(400, "You cannot subscribe to your own channel");
  if (!(await User.exists({ _id: channelId }))) throw new ApiError(404, "Channel not found");

  const subscription = await Subscription.findOne({ subscriber, channel: channelId });
  if (subscription) {
    await subscription.deleteOne();
    return res.status(200).json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"));
  }
  let createdSubscription;
  try {
    createdSubscription = await Subscription.create({ subscriber, channel: channelId });
  } catch (error) {
    if (error?.code !== 11000) throw error;
    return res.status(200).json(new ApiResponse(200, { subscribed: true }, "Already subscribed"));
  }
  return res.status(201).json(new ApiResponse(201, { subscribed: true, subscription: createdSubscription }, "Subscribed successfully"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel id");
  if (!(await User.exists({ _id: channelId }))) throw new ApiError(404, "Channel not found");
  const subscribers = await Subscription.find({ channel: channelId })
    .sort({ createdAt: -1 })
    .populate("subscriber", "username fullName avatar");
  return res.status(200).json(new ApiResponse(200, subscribers, "Channel subscribers fetched successfully"));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!mongoose.isValidObjectId(subscriberId)) throw new ApiError(400, "Invalid subscriber id");
  if (!(await User.exists({ _id: subscriberId }))) throw new ApiError(404, "User not found");
  const subscriptions = await Subscription.find({ subscriber: subscriberId })
    .sort({ createdAt: -1 })
    .populate("channel", "username fullName avatar");
  return res.status(200).json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
