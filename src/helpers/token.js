import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";


export function genAccessToken(payload) {
    if (payload === "" || payload === undefined) {
        return this.Error("Access token requires a payload field but got none");
    }

    return jwt.sign(payload, JWT_SECRET, { expiresIn: "10h" });
}

export function genRefreshToken(payload) {
    if (payload === "" || payload === undefined) {
        return this.Error("Refresh token requires a payload field but got none");
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1yr" });
}

export const decodeJwt = (token = "") => {
    let res = {}
    if (token === "" || token === undefined) {
        res.id = null;
        res.message = "expected accessToken for decoding, but got none"
        return res
    }


    const decoded = jwt.decode(token);

    if (decoded?.id === undefined) {
        res.id = decoded?.id;
        res.message = "Invalid JWT token."
        return res
    }

    res.id = decoded?.id;
    res.message = "success"
    return res
}