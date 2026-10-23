import mongoose from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid user id");
  if (!(await User.exists({ _id: userId }))) throw new ApiError(404, "User not found");
  if (String(userId) !== String(req.user._id)) throw new ApiError(403, "You are not allowed to view these playlists");
  const playlists = await Playlist.find({ owner: userId }).sort({ updatedAt: -1 });
  return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!mongoose.isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist id");
  const playlist = await Playlist.findOne({ _id: playlistId, owner: req.user._id }).populate({
    path: "videos",
    match: { isPublished: true },
    populate: { path: "owner", select: "username fullName avatar" },
  }).populate("owner", "username fullName avatar");
  if (!playlist) {
    if (!(await Playlist.exists({ _id: playlistId }))) throw new ApiError(404, "Playlist not found");
    throw new ApiError(403, "You are not allowed to view this playlist");
  }
  return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const createPlaylist = asyncHandler(async (req, res) => {
  const name = req.body?.name;
  const description = req.body?.description;
  if (typeof name !== "string" || typeof description !== "string") {
    throw new ApiError(400, "Playlist name and description are required");
  }
  if (!name || !description) throw new ApiError(400, "Playlist name and description are required");
  if (!name.trim() || !description.trim()) throw new ApiError(400, "Playlist name and description are required");
  const playlist = await Playlist.create({ name: name.trim(), description: description.trim(), owner: req.user._id });
  return res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const updates = {};
  if (req.body?.name !== undefined) {
    if (typeof req.body.name !== "string" || !req.body.name.trim()) throw new ApiError(400, "Playlist name cannot be empty");
    updates.name = req.body.name.trim();
  }
  if (req.body?.description !== undefined) {
    if (typeof req.body.description !== "string" || !req.body.description.trim()) throw new ApiError(400, "Playlist description cannot be empty");
    updates.description = req.body.description.trim();
  }
  if (!mongoose.isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist id");
  if (!Object.keys(updates).length) throw new ApiError(400, "Provide a name or description to update");
  const playlist = await Playlist.findOneAndUpdate(
    { _id: playlistId, owner: req.user._id }, { $set: updates }, { new: true, runValidators: true },
  );
  if (!playlist) {
    if (!(await Playlist.exists({ _id: playlistId }))) throw new ApiError(404, "Playlist not found");
    throw new ApiError(403, "You are not allowed to update this playlist");
  }
  return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!mongoose.isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist id");
  const playlist = await Playlist.findOneAndDelete({ _id: playlistId, owner: req.user._id });
  if (!playlist) {
    if (!(await Playlist.exists({ _id: playlistId }))) throw new ApiError(404, "Playlist not found");
    throw new ApiError(403, "You are not allowed to delete this playlist");
  }
  return res.status(200).json(new ApiResponse(200, playlist, "Playlist deleted successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!mongoose.isValidObjectId(playlistId) || !mongoose.isValidObjectId(videoId)) throw new ApiError(400, "Invalid playlist or video id");
  if (!(await Video.exists({ _id: videoId }))) throw new ApiError(404, "Video not found");
  const playlist = await Playlist.findOneAndUpdate(
    { _id: playlistId, owner: req.user._id }, { $addToSet: { videos: videoId } }, { new: true },
  );
  if (!playlist) {
    if (!(await Playlist.exists({ _id: playlistId }))) throw new ApiError(404, "Playlist not found");
    throw new ApiError(403, "You are not allowed to update this playlist");
  }
  return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!mongoose.isValidObjectId(playlistId) || !mongoose.isValidObjectId(videoId)) throw new ApiError(400, "Invalid playlist or video id");
  if (!(await Video.exists({ _id: videoId }))) throw new ApiError(404, "Video not found");
  const playlist = await Playlist.findOneAndUpdate(
    { _id: playlistId, owner: req.user._id }, { $pull: { videos: videoId } }, { new: true },
  );
  if (!playlist) {
    if (!(await Playlist.exists({ _id: playlistId }))) throw new ApiError(404, "Playlist not found");
    throw new ApiError(403, "You are not allowed to update this playlist");
  }
  return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist"));
});

export { getUserPlaylists, getPlaylistById, createPlaylist, updatePlaylist, deletePlaylist, addVideoToPlaylist, removeVideoFromPlaylist };
