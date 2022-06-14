import express from "express"
import sendResponse from "../helpers/response";
import Tasks from "../services/tasks";
import { isLoggedIn } from "../middlewares/auth"



const router = express.Router()

const Task = new Tasks()

export const addTasks = router.post("/addTasks", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "Adding of Tasks failed: expected valid payload")
    }

    return Task.add(res, payload)

})

export const getTasks = router.post("/getTasks", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "getting of Tasks failed: expected valid payload")
    }

    return Task.getTasks(res, payload)

})

export const completeTask = router.put("/completeTask", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "Adding of Tasks failed: expected valid payload")
    }

    return Task.completeTask(res, payload)

})