import sendResponse from "../helpers/response";
import { genId } from "../helpers/util";
import { PrismaClient } from "@prisma/client"


const prismaDB = new PrismaClient()

export default class TemplateForm {

    async update(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { heading, subHeading, profileImg, username, userCareer, ratings, userId, templateId, templateFormId } = payload;

            if (userId === undefined || userId === "") {
                return sendResponse(res, 400, true, "userId cant be empty.")
            }
            if (templateId === undefined || templateId === "") {
                return sendResponse(res, 400, true, "templateId cant be empty.")
            }
            if (templateFormId === undefined || templateFormId === "") {
                return sendResponse(res, 400, true, "templateFormId cant be empty.")
            }

            // check if user with that ID is valid
            const userExists = await prismaDB.user.findMany({
                where: {
                    id: userId
                }
            })

            if (userExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to update template form, user doesnt exist with that ID.")
            }

            // check if collection with that ID exists
            const templateExists = await prismaDB.templates.findMany({
                where: {
                    id: templateId
                }
            })

            if (templateExists.length === 0) {
                return sendResponse(res, 404, true, "Failed to update template form, no template was found with that ID.")
            }

            const validHeading = heading === undefined || heading === "" ? "Feedback Form" : heading;
            const validSubHeading = subHeading === undefined || subHeading === "" ? "Your feedback is highly appreciated" : subHeading;
            const validProfileImage = profileImg === undefined || typeof profileImg !== "boolean" ? false : profileImg;
            const validUsername = username === undefined || typeof username !== "boolean" ? false : username;
            const validUserCareer = userCareer === undefined || typeof userCareer !== "boolean" ? false : userCareer;
            const validRatings = ratings === undefined || typeof ratings !== "boolean" ? false : ratings;

            try {
                const formData = {
                    id: templateFormId,
                    userId,
                    templateId,
                    heading: validHeading,
                    subHeading: validSubHeading,
                    profileImg: validProfileImage,
                    username: validUsername,
                    userCareer: validUserCareer,
                    ratings: validRatings,
                }

                await prismaDB.form.update({
                    data: formData,
                    where: {
                        id: templateFormId
                    }
                })

                const templateForm = await prismaDB.form.findMany({
                    where: {
                        id: templateFormId
                    }
                })

                return sendResponse(res, 200, false, "Template Form successfully updated.", templateForm)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }
}
