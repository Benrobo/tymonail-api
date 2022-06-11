import httpStatus from "http-status";
import sendJson from "./sendJson";


export default function sendResponse(res, status = 500, errorState = true, message = "", data = {}) {
    let response = {}
    response["error"] = errorState
    response["status"] = status
    response["message"] = message
    response["data"] = data

    return sendJson(res, response, status)
}
