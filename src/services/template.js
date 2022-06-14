import sendResponse from "../helpers/response";
import { genId } from "../helpers/util";
import { PrismaClient } from "@prisma/client"


const prismaDB = new PrismaClient()

export default class Templates {

    async create(res, payload) {
        if (res === undefined) {
            throw new Error("Expected res object but got undefined")
        }

        if (Object.entries(payload).length > 0) {

            const { name, userId } = payload;

            if (name === undefined || name === "") {
                return sendResponse(res, 400, true, "name cant be blank.")
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
                return sendResponse(res, 404, true, "Failed to create template, user doesnt exist with that ID.")
            }

            try {

                const templateId = genId()

                const templateData = {
                    id: templateId,
                    name,
                    userId,
                }

                // create template form data
                const templateformData = {
                    id: genId(),
                    userId,
                    templateId,
                    heading: "Feedback Form",
                    subHeading: "Your feedback is highly appreciated",
                    profileImg: false,
                    username: true,
                    userCareer: false,
                    ratings: true,
                }

                await prismaDB.templates.create({ data: templateData })
                await prismaDB.form.create({ data: templateformData })

                const allTempData = await prismaDB.templates.findMany({
                    where: {
                        userId
                    },
                    include: {
                        form: true
                    }
                })


                return sendResponse(res, 200, false, "Templates successfully created.", allTempData)
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }

    async getTemplatess(res, payload) {
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
