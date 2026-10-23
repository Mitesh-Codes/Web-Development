import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Comment reads and writes require an authenticated user.
router.use(verifyJWT);

router.get("/:videoId", getVideoComments);
router.post("/:videoId", addComment);
router.patch("/c/:commentId", updateComment);
router.delete("/c/:commentId", deleteComment);

export default router;
