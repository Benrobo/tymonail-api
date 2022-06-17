import express from "express"
import sendResponse from "../helpers/response";
import { isLoggedIn } from "../middlewares/auth"
import FeedBacks from "../services/feedbacks";

const router = express.Router()

const Feedback = new FeedBacks()

router.post("/add", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "adding of feedback failed: expected valid payload")
    }

    return Feedback.add(res, payload)

})

router.post("/get", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "fetching of feedbacks failed: expected valid payload")
    }

    return Feedback.getFeedbacks(res, payload)

})

export default router