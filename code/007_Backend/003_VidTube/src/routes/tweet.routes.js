import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);
router.get("/user/:userId", getUserTweets);
router.route("/").post(createTweet);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;
