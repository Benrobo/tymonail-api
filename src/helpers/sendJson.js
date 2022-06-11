

export default function sendJson(res, data, status) {
    return res.status(status).json(data)
}