import express from "express"
import sendResponse from "../helpers/response";
import Auth from "../services/auth";
const router = express.Router()

const auth = new Auth()

export const registerUser = router.post("/register", (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "Register Authentication failed: expected valid payload")
    }

    return auth.registerUser(res, payload)

})

export const loginUser = router.post("/login", (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "Login Authentication failed: expected valid payload")
    }

    return auth.loginUser(res, payload)

})
