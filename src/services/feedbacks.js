import sendResponse from "../helpers/response";
import { genId } from "../helpers/util";
import { PrismaClient } from "@prisma/client"


const prismaDB = new PrismaClient()

export default class FeedBacks {

    async add(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { name, ratings, message, templateId, userId } = payload;

            if (name === undefined || name === "") {
                return sendResponse(res, 400, true, "name cant be blank.")
            }
            if (userId === undefined || userId === "") {
                return sendResponse(res, 400, true, "userId cant be empty.")
            }
            if (templateId === undefined || templateId === "") {
                return sendResponse(res, 400, true, "templateId cant be empty.")
            }
            if (ratings === undefined || ratings === "") {
                return sendResponse(res, 400, true, "ratings cant be empty.")
            }
            if (message === undefined || message === "") {
                return sendResponse(res, 400, true, "message cant be empty.")
            }

            // check if user with that ID is valid
            const userExists = await prismaDB.user.findMany({
                where: {
                    id: userId
                }
            })

            if (userExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to add feedback, something went wrong with the userId added.")
            }

            // check if template exists
            const tempExists = await prismaDB.templates.findMany({
                where: {
                    id: templateId
                }
            })

            if (tempExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to add feedback, provided template doesnt exists within our record.")
            }

            try {

                const _checkNonProvidedInput = {
                    profileImg: payload.profileImg === undefined ? "" : payload.profileImg,
                    userCareer: payload.userCareer === undefined ? "" : payload.userCareer,
                }


                const feedbackData = {
                    id: genId(),
                    feedbackId: genId(),
                    userId,
                    templateId,
                    name,
                    message,
                    ratings,
                    profileImg: _checkNonProvidedInput.profileImg,
                    userCareer: _checkNonProvidedInput.userCareer,
                    isActive: false
                }

                // insert feedbacks
                await prismaDB.feedbacks.create({ data: feedbackData })
                // await prismaDB.

                const allFeedbacks = await prismaDB.feedbacks.findMany({
                    where: {
                        userId
                    }
                })


                return sendResponse(res, 200, false, "feedback added successfully.", allFeedbacks)
            } catch (err) {
                console.log(err);
                return sendResponse(res, 500, true, err.message)
            }
        }
    }

    async getFeedbacks(res, payload) {
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
                return sendResponse(res, 404, true, "Failed to get templates, user doesnt exist with that ID.")
            }

            try {

                const allTempData = await prismaDB.templates.findMany({
                    where: {
                        userId
                    },
                    include: {
                        form: true
                    }
                })


                return sendResponse(res, 200, false, "fetching templates successfully created.", allTempData)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }
}