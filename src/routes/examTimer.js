import express from "express"
import sendResponse from "../helpers/response";
import ExamTimer from "../services/examTimer";
import { isLoggedIn } from "../middlewares/auth"



const router = express.Router()

const ExamsTimer = new ExamTimer()

export const addExamTime = router.post("/add", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "Adding of exam time failed: expected valid payload")
    }

    return ExamsTimer.add(res, payload)

})

export const getExamsTime = router.post("/get", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "Getting of exam time failed: expected valid payload")
    }

    return ExamsTimer.getExamTimes(res, payload)

})

export const deleteExamTime = router.delete("/delete", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "Deleting of exam time failed: expected valid payload")
    }

    return ExamsTimer.deleteTimer(res, payload)

})