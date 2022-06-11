import sendResponse from "../helpers/response";
import { compareHash, generateHash, genId } from "../helpers/util";
import { genAccessToken, genRefreshToken } from "../helpers/token";
import { PrismaClient } from "@prisma/client"


const prismaDB = new PrismaClient()

export default class Auth {

    async registerUser(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { username, email, password } = payload;

            if (username === undefined) {
                return sendResponse(res, 400, true, "username cant be blank.")
            }
            if (email === undefined) {
                return sendResponse(res, 400, true, "email cant be blank.")
            }
            if (password === undefined) {
                return sendResponse(res, 400, true, "password cant be blank.")
            }

            // check if user with that mai already exist
            const result = await prismaDB.user.findMany({
                where: {
                    email
                }
            })

            if (result.length > 0) {
                return sendResponse(res, 400, true, "User with that email already exists")
            }

            const id = genId()
            const hash = generateHash(password)

            const dataSaved = {
                id,
                name: username,
                email,
                hash,
                refreshToken: ""
            }

            try {
                const saveUser = await prismaDB.user.create({ data: dataSaved })

                return sendResponse(res, 200, false, "User Registered Successfull.", saveUser)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }

    async loginUser(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { email, password } = payload;

            if (email === undefined) {
                return sendResponse(res, 400, true, "email cant be blank.")
            }
            if (password === undefined) {
                return sendResponse(res, 400, true, "password cant be blank.")
            }

            // check if user with that mai already exist
            const result = await prismaDB.user.findMany({
                where: {
                    email
                }
            })

            if (result.length === 0) {
                return sendResponse(res, 404, true, "User with this email wasnt exists")
            }

            if (result.length > 0) {
                const { hash, name, email, id } = result[0]

                // verify password
                if (compareHash(password, hash) === false) {
                    return sendResponse(res, 400, true, "Password given is incorrect.")
                }

                try {
                    const refreshToken = genRefreshToken({ id, email })
                    const accesToken = genAccessToken({ id, email })

                    const dataSaved = {
                        id,
                        name,
                        token: accesToken
                    }
                    // update user refreshtoken
                    const saveUser = await prismaDB.user.update({
                        where: {
                            email
                        },
                        data: {
                            refreshToken
                        }
                    })

                    return sendResponse(res, 200, false, "Logged In successfull.", dataSaved)
                } catch (err) {
                    console.log(err);
                    return sendResponse(res, 500, true, err.message)
                }
            }
        }
    }
}