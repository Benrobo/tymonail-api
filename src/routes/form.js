import express from "express"
import sendResponse from "../helpers/response";
import { isLoggedIn } from "../middlewares/auth"
import TemplateForm from "../services/form";



const router = express.Router()

const TmpForm = new TemplateForm()

router.post("/get", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "fetching of template form failed: expected valid payload")
    }

    return TmpForm.get(res, payload)

})

router.put("/updateForm", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "updating of template form failed: expected valid payload")
    }

    return TmpForm.update(res, payload)

})

export default router