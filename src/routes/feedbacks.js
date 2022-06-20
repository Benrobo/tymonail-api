import express from "express"
import sendResponse from "../helpers/response";
import { isLoggedIn } from "../middlewares/auth"
import FeedBacks from "../services/feedbacks";

const router = express.Router()

const Feedback = new FeedBacks()

router.get("/get", (req, res) => {

    if (Object.entries(req.query).length === 0) {
        return sendResponse(res, 500, true, "fetching of feedbacks failed: expected valid payload")
    }

    return Feedback.getFeedbacks(res, req.query)

})

router.post("/add", (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "adding of feedback failed: expected valid payload")
    }

    return Feedback.add(res, payload)

})

router.post("/get", (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "fetching of feedbacks failed: expected valid payload")
    }

    return Feedback.getFeedbacks(res, payload)

})

router.put("/publish", (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "publishing of feedbacks failed: expected valid payload")
    }

    return Feedback.publishFeedback(res, payload)

})

router.delete("/delete", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "deleting of feedbacks failed: expected valid payload")
    }

    return Feedback.delete(res, payload)

})

export default router