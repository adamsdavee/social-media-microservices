const express = require("express")
const { searchPostController } = require("../controllers/search.controller")
const { authenticateRequest } = require("../middlewares/auth.middleware")

const searchRouter = express.Router()

searchRouter.use(authenticateRequest)

searchRouter.post("/post", searchPostController)

module.exports = searchRouter
