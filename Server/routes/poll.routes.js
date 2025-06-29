import express from 'express'
import { createPoll, deletePoll, getActivePolls, getAllPolls, getPollAnalytics, getPollById, votePoll } from "../controllers/poll.controller.js";
import {requireSignIn} from '../middlewares/auth.js'
const router=express.Router();
router.post("/createpoll",requireSignIn,createPoll);
router.get("/getallpolls",getAllPolls);
router.post("/votepoll/:pollId",requireSignIn,votePoll);
router.get("/poll/:pollId",requireSignIn, getPollById);
router.delete("/poll/:pollId", requireSignIn, deletePoll);
router.get("/polls/active",requireSignIn, getActivePolls);
router.get("/poll/:pollId/analytics",requireSignIn, requireSignIn, getPollAnalytics);

export default router;