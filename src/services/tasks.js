import sendResponse from "../helpers/response";
import { genId } from "../helpers/util";
import { PrismaClient } from "@prisma/client"


const prismaDB = new PrismaClient()

export default class Tasks {

    async add(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { title, description, userId, collectionId } = payload;

            if (title === undefined || title === "") {
                return sendResponse(res, 400, true, "title cant be blank.")
            }
            if (description === undefined || description === "") {
                return sendResponse(res, 400, true, "description cant be empty.")
            }
            if (userId === undefined || userId === "") {
                return sendResponse(res, 400, true, "userId cant be empty.")
            }
            if (collectionId === undefined || collectionId === "") {
                return sendResponse(res, 400, true, "collectionId cant be empty.")
            }

            // check if user with that ID is valid
            const userExists = await prismaDB.user.findMany({
                where: {
                    id: userId
                }
            })

            if (userExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to add tasks, user doesnt exist with that ID.")
            }

            // check if collection with that ID exists
            const collectionExists = await prismaDB.collections.findMany({
                where: {
                    id: collectionId
                }
            })

            if (collectionExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to add tasks, no collection was found with that ID.")
            }

            try {
                const tasksData = {
                    id: genId(),
                    userId,
                    collectionId,
                    title,
                    description,
                    completed: false
                }

                await prismaDB.tasks.create({ data: tasksData })

                const allTasks = await prismaDB.tasks.findMany({
                    where: {
                        userId
                    }
                })

                const tasksBasedOnCollectionId = allTasks.filter((list) => list.collectionId === collectionId)

                return sendResponse(res, 200, false, "Tasks successfully added.", tasksBasedOnCollectionId)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }

    async getTasks(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { userId, collectionId } = payload;

            if (userId === undefined || userId === "") {
                return sendResponse(res, 400, true, "userId cant be empty.")
            }
            if (collectionId === undefined || collectionId === "") {
                return sendResponse(res, 400, true, "collectionId cant be empty.")
            }

            // check if user with that ID is valid
            const userExists = await prismaDB.user.findMany({
                where: {
                    id: userId
                }
            })

            if (userExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to fetch tasks, user doesnt exist with that ID.")
            }

            try {

                const allTasks = await prismaDB.tasks.findMany({
                    where: {
                        userId
                    }
                })

                const filteredData = allTasks.filter((list) => list.collectionId === collectionId)

                return sendResponse(res, 200, false, "fetching tasks successfully created.", filteredData)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }

    async completeTask(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { userId, taskId, collectionId, completed } = payload;

            if (userId === undefined || userId === "") {
                return sendResponse(res, 400, true, "userId cant be empty.")
            }
            if (taskId === undefined || taskId === "") {
                return sendResponse(res, 400, true, "taskId cant be empty.")
            }
            if (collectionId === undefined || collectionId === "") {
                return sendResponse(res, 400, true, "collectionId cant be empty.")
            }
            if (completed === undefined || completed === "") {
                return sendResponse(res, 400, true, "completed cant be empty.")
            }

            // check if user with that ID is valid
            const userExists = await prismaDB.user.findMany({
                where: {
                    id: userId
                }
            })

            if (userExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to complete tasks, user doesnt exist with that ID.")
            }

            // check if collection with that ID exists
            const collectionExists = await prismaDB.collections.findMany({
                where: {
                    id: collectionId
                }
            })

            if (collectionExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to complete tasks, no collection was found with that task.")
            }

            // check if task exists
            const taskExists = await prismaDB.tasks.findMany({
                where: {
                    id: taskId
                }
            })

            if (taskExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to complete tasks, no task was found with that ID.")
            }

            try {
                const updatedTasksData = {
                    completed
                }

                await prismaDB.tasks.update({
                    where: {
                        id: taskId
                    },
                    data: updatedTasksData
                })

                const allTasks = await prismaDB.tasks.findMany({
                    where: {
                        userId,
                        collectionId
                    }
                })

                return sendResponse(res, 200, false, "Tasks successfully added.", allTasks)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }
}
