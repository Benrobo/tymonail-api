import sendResponse from "../helpers/response";
import { genId } from "../helpers/util";
import { prisma, PrismaClient } from "@prisma/client"


const prismaDB = new PrismaClient()

const generateTmpId = (count = 5) => {
    const data = "0123456789abcdefgh".split("")
    let id = ""
    for (let i = 0; i < count; i++) {
        let rand = Math.floor(Math.random() * data.length)
        id += data[rand]
    }
    return id
}

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

                const templateId = `temp_${generateTmpId(6)}`

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
                    }
                })


                return sendResponse(res, 200, false, "fetching templates successfully created.", allTempData)
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

            const { userId, templateId } = payload;

            if (templateId === undefined || templateId === "") {
                return sendResponse(res, 400, true, "templateId cant be blank.")
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
                return sendResponse(res, 404, true, "Failed to delete template, user doesnt exist with that ID.")
            }

            try {

                // check if template exists
                const isTempExists = await prismaDB.templates.findMany({
                    where: {
                        id: templateId
                    }
                })

                // check if template was created by the user
                const checkUserTemp = isTempExists.filter(temp => temp.userId === userId)

                if (isTempExists.length === 0) return sendResponse(res, 400, false, "Failed to delete. template doesnt exists.")

                if (checkUserTemp.length === 0) return sendResponse(res, 403, false, "Failed: cant delete template which wasnt uploaded by you.")

                await prismaDB.templates.delete({
                    where: {
                        id: templateId
                    }
                })
                await prismaDB.form.delete({
                    where: {
                        templateId
                    }
                })
                await prismaDB.feedbacks.delete({
                    where: {
                        templateId
                    }
                })

                return sendResponse(res, 200, false, "Templates successfully deleted.")
            } catch (err) {
                return sendResponse(res, 500, true, err.message)
            }
        }
    }
}
