import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);
router.post("/", createPlaylist);
router.get("/user/:userId", getUserPlaylists);
router.patch("/:playlistId/video/:videoId", addVideoToPlaylist);
router.delete("/:playlistId/video/:videoId", removeVideoFromPlaylist);
router.route("/:playlistId").get(getPlaylistById).patch(updatePlaylist).delete(deletePlaylist);

export default router;
