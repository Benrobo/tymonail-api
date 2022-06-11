import sendResponse from "../helpers/response";
import { genId } from "../helpers/util";
import { PrismaClient } from "@prisma/client"


const prismaDB = new PrismaClient()

export default class ExamTimer {

    async add(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { coursename, time, description, paperType, userId, color } = payload;

            if (coursename === undefined || coursename === "") {
                return sendResponse(res, 400, true, "coursename cant be blank.")
            }
            if (userId === undefined || userId === "") {
                return sendResponse(res, 400, true, "userId cant be empty.")
            }
            if (description === undefined || description === "") {
                return sendResponse(res, 400, true, "description cant be empty.")
            }
            if (paperType === undefined || paperType === "") {
                return sendResponse(res, 400, true, "paperType cant be empty.")
            }
            if (time === undefined || time === "") {
                return sendResponse(res, 400, true, "time cant be empty.")
            }

            // check if user with that ID is valid
            const userExists = await prismaDB.user.findMany({
                where: {
                    id: userId
                }
            })

            if (userExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to add exam time, user doesnt exist with that ID.")
            }

            try {
                const examsTimerData = {
                    id: genId(),
                    userId,
                    coursename,
                    description,
                    paperType,
                    color,
                    time
                }

                await prismaDB.examstimer.create({ data: examsTimerData })

                const allTimer = await prismaDB.examstimer.findMany({
                    where: {
                        userId
                    }
                })


                return sendResponse(res, 200, false, "Exam timer successfully added.", allTimer)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }

    async getExamTimes(res, payload) {
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
                return sendResponse(res, 404, true, "Failed to fetch all exams time, user doesnt exist with that ID.")
            }

            try {

                const allTimes = await prismaDB.examstimer.findMany({
                    where: {
                        userId
                    }
                })


                return sendResponse(res, 200, false, "fetching exams time successfully created.", allTimes)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }

    async deleteTimer(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { userId, timerId } = payload;

            if (userId === undefined || userId === "") {
                return sendResponse(res, 400, true, "userId cant be empty.")
            }
            if (timerId === undefined || timerId === "") {
                return sendResponse(res, 400, true, "timer ID cant be empty.")
            }

            // check if user with that ID is valid
            const userExists = await prismaDB.user.findMany({
                where: {
                    id: userId
                }
            })

            if (userExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to delete exams time, user doesnt exist with that ID.")
            }

            try {

                // check if timer exists
                const isExists = await prismaDB.examstimer.findMany({
                    where: {
                        id: timerId
                    }
                })

                if (isExists.length === 0) {
                    return sendResponse(res, 404, true, "Failed to delete exams time, timer doesnt exist with that ID.")
                }

                await prismaDB.examstimer.delete({
                    where: {
                        id: timerId
                    }
                })

                const allTimes = await prismaDB.examstimer.findMany({
                    where: {
                        userId
                    }
                })


                return sendResponse(res, 200, false, "exams time deleted successfully created.", allTimes)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }
}