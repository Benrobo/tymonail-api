import express from "express"
import sendResponse from "../helpers/response";
import { isLoggedIn } from "../middlewares/auth"
import Templates from "../services/template";

const router = express.Router()

const Template = new Templates()

router.post("/create", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "Creating of template failed: expected valid payload")
    }

    return Template.create(res, payload)

})

router.post("/get", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "fetching of template failed: expected valid payload")
    }

    return Template.getTemplatess(res, payload)

})

export default router