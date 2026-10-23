import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);
router.get("/c/:channelId", getUserChannelSubscribers);
router.post("/c/:channelId", toggleSubscription);
router.get("/u/:subscriberId", getSubscribedChannels);

export default router;
