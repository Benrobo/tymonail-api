import sendResponse from "../helpers/response";
import { genId } from "../helpers/util";
import { PrismaClient } from "@prisma/client"


const prismaDB = new PrismaClient()

export default class Collections {

    async create(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { title, userId, color } = payload;

            if (title === undefined || title === "") {
                return sendResponse(res, 400, true, "title cant be blank.")
            }
            if (userId === undefined || userId === "") {
                return sendResponse(res, 400, true, "userId cant be empty.")
            }

            // check if user with that ID is valid
            const userExists = await prismaDB.user.findMany({
                where: {
                    id: userId
                }
            })

            if (userExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to add collection, user doesnt exist with that ID.")
            }

            try {
                const collectionData = {
                    id: genId(),
                    userId,
                    title,
                    color
                }

                await prismaDB.collections.create({ data: collectionData })

                const allCollections = await prismaDB.collections.findMany({
                    where: {
                        userId
                    }
                })


                return sendResponse(res, 200, false, "Collection successfully created.", allCollections)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }

    async getCollections(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { userId } = payload;

            if (userId === undefined || userId === "") {
                return sendResponse(res, 400, true, "userId cant be empty.")
            }

            // check if user with that ID is valid
            const userExists = await prismaDB.user.findMany({
                where: {
                    id: userId
                }
            })

            if (userExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to add collection, user doesnt exist with that ID.")
            }

            try {

                const allCollections = await prismaDB.collections.findMany({
                    where: {
                        userId
                    }
                })

                const allTasks = await prismaDB.tasks.findMany({
                    where: {
                        userId
                    }
                })

                const packedData = {
                    collections: allCollections,
                    tasks: allTasks
                }


                return sendResponse(res, 200, false, "fetching collections successfully created.", packedData)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }
}
