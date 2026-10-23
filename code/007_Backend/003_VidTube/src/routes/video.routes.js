import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { cleanupUploadedFiles, upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.get("/", getAllVideos);
router.get("/user/:userId", getAllVideos);
router.post(
  "/",
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  cleanupUploadedFiles,
  publishAVideo,
);
router.get("/:videoId", verifyJWT, getVideoById);
router.patch("/:videoId", verifyJWT, upload.single("thumbnail"), cleanupUploadedFiles, updateVideo);
router.delete("/:videoId", verifyJWT, deleteVideo);
router.patch("/:videoId/publish", verifyJWT, togglePublishStatus);

export default router;
