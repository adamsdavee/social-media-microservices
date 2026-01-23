const express = require("express")
const { registerUser } = require("../controllers/identity.controller")

const identityRouter = express.Router()

identityRouter.post("/register", registerUser)

module.exports = identityRouter
