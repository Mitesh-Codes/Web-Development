import { Router } from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);
router.get("/videos", getLikedVideos);
router.post("/toggle/v/:videoId", toggleVideoLike);
router.post("/toggle/c/:commentId", toggleCommentLike);
router.post("/toggle/t/:tweetId", toggleTweetLike);

export default router;
