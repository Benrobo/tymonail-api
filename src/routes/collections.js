import express from "express"
import sendResponse from "../helpers/response";
import Collections from "../services/collections";
import { isLoggedIn } from "../middlewares/auth"



const router = express.Router()

const Collection = new Collections()

export const createCollection = router.post("/create", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "Creating of collection failed: expected valid payload")
    }

    return Collection.create(res, payload)

})

export const getCollections = router.post("/get", isLoggedIn, (req, res) => {
    const payload = req.body;

    if (Object.entries(payload).length === 0) {
        return sendResponse(res, 500, true, "fetching of collections failed: expected valid payload")
    }

    return Collection.getCollections(res, payload)

})