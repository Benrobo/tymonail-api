import dotenv from "dotenv"

dotenv.config()

export const DATABASE_URL = process.env.DATABASE_URL

export const MAX_API_REQUEST = process.env.MAX_API_REQUEST_COUNT

export const JWT_SECRET = process.env.JWT_SECRET

export const NODE_ENV = process.env.NODE_ENV
