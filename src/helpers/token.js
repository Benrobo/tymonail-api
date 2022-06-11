import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";


export function genAccessToken(payload) {
    if (payload === "" || payload === undefined) {
        return this.Error("Access token requires a payload field but got none");
    }

    return jwt.sign(payload, JWT_SECRET, { expiresIn: "60min" });
}

export function genRefreshToken(payload) {
    if (payload === "" || payload === undefined) {
        return this.Error("Refresh token requires a payload field but got none");
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1yr" });
}

