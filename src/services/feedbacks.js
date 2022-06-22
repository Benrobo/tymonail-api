import sendResponse from "../helpers/response";
import { genId } from "../helpers/util";
import { PrismaClient } from "@prisma/client"


const prismaDB = new PrismaClient()


// This is applicable for getFeedbacks() method
/**
 * type : feedback_type
 * @param ( user | non-user )
 * 
 * if type === "non-user"
 *      templateId is required.
 * if type === "user"
 *      templateId is not required. userId is used
 */

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
                    published: false
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

            const validFeedbackType = ["user", "non-user"];
            const { userId, templateId, type } = payload;

            const isValidType = validFeedbackType.includes(type) ? true : false;
            let feedbackResult = null;

            if (userId === undefined || userId === "") {
                return sendResponse(res, 400, true, "userId cant be empty.")
            }
            if (!isValidType) {
                return sendResponse(res, 404, true, `failed to get feedbacks, invalid type "${type}".`)
            }
            if ((isValidType && type === "non-user") && (templateId === undefined || templateId === "")) {
                return sendResponse(res, 404, true, "failed to get feedbacks, template ID is invalid or missing.")
            }


            // check if user with that ID is valid
            const userExists = await prismaDB.user.findMany({
                where: {
                    id: userId
                }
            })

            if (userExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to get feedbacks, user doesnt exist with that ID.")
            }

            try {
                // check if template exists based on ID
                if (isValidType && type === "non-user") {
                    const allTempData = await prismaDB.templates.findMany({
                        where: {
                            id: templateId
                        }
                    })

                    if (allTempData.length === 0) {
                        return sendResponse(res, 404, true, "Failed fetching feedbacks, template ID doesnt exists.")
                    }

                    // if all is well
                    // first: get feedback based on userId
                    const feedbackByUserId = await prismaDB.feedbacks.findMany({
                        where: {
                            userId
                        }
                    })
                    // second: filter the result based on templateId
                    feedbackResult = feedbackByUserId.length > 0 ? feedbackByUserId.filter(temp => temp.templateId === templateId) : []

                    return sendResponse(res, 200, false, "feedbacks successfully fetched.", feedbackResult)
                }


                feedbackResult = await prismaDB.feedbacks.findMany({
                    where: {
                        userId
                    }
                })

                return sendResponse(res, 200, false, "fetching feedbacks successfully created.", feedbackResult)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }

    async publishFeedback(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { userId, id, published } = payload;

            if (userId === undefined || userId === "") {
                return sendResponse(res, 400, true, "userId cant be empty.")
            }
            if (id === undefined || id === "") {
                return sendResponse(res, 400, true, "feedback id cant be empty.")
            }
            if (published === undefined || published === "") {
                return sendResponse(res, 400, true, "feedback published state cant be empty.")
            }

            // check published state
            const isValidPublished = typeof published !== "boolean" ? true : false;

            if (isValidPublished) {
                return sendResponse(res, 400, true, "invalid feedback published state.")
            }

            try {

                // check if user with that ID is valid
                const userExists = await prismaDB.user.findMany({
                    where: {
                        id: userId
                    }
                })

                // check if feedback exists based on ID
                const feedbackExists = await prismaDB.feedbacks.findMany({
                    where: {
                        feedbackId: id
                    }
                })

                if (userExists.length === 0) {
                    return sendResponse(res, 404, true, "failed to publish feedback, user doesnt exist with that ID.")
                }

                if (feedbackExists.length === 0) {
                    return sendResponse(res, 404, true, "failed to publish. feedback with this id doesnt exists.")
                }

                // delete feedback with that ID
                await prismaDB.feedbacks.update({
                    where: {
                        feedbackId: id
                    },
                    data: {
                        published
                    }
                })


                const feedbackResult = await prismaDB.feedbacks.findMany({
                    where: {
                        userId
                    }
                })

                return sendResponse(res, 200, false, "feedback successfully published.", feedbackResult)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }

    async delete(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { userId, id } = payload;


            if (userId === undefined || userId === "") {
                return sendResponse(res, 400, true, "userId cant be empty.")
            }
            if (id === undefined || id === "") {
                return sendResponse(res, 400, true, "feedback id cant be empty.")
            }


            try {

                // check if user with that ID is valid
                const userExists = await prismaDB.user.findMany({
                    where: {
                        id: userId
                    }
                })

                // check if feedback exists based on ID
                const feedbackExists = await prismaDB.feedbacks.findMany({
                    where: {
                        feedbackId: id
                    }
                })

                if (userExists.length === 0) {
                    return sendResponse(res, 404, true, "Failed to delete feedback, user doesnt exist with that ID.")
                }

                if (feedbackExists.length === 0) {
                    return sendResponse(res, 404, true, "failed to delete. feedback with this id doesnt exists.")
                }

                // delete feedback with that ID
                await prismaDB.feedbacks.delete({
                    where: {
                        feedbackId: id
                    }
                })


                const feedbackResult = await prismaDB.feedbacks.findMany({
                    where: {
                        userId
                    }
                })

                return sendResponse(res, 200, false, "feedback successfully deleted.", feedbackResult)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }
}
