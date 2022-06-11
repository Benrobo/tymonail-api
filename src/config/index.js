import dotenv from "dotenv"

dotenv.config()

export const DATABASE_URL = process.env.DATABASE_URL

export const MAX_API_REQUEST = process.env.MAX_API_REQUEST_COUNT

export const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID

export const AUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET

export const AUTH_CALLBACK_URL = process.env.AUTH_CALLBACK_URL

export const DISCORD_APP_ID = process.env.DISCORD_APP_ID

export const DISCORD_PUB_KEY = process.env.DISCORD_PUB_KEY

export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID

export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET

export const JWT_SECRET = process.env.JWT_SECRET
