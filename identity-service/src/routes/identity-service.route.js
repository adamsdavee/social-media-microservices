const express = require("express")
const {
   registerUser,
   loginUser,
   refreshTokenUser,
   logout,
} = require("../controllers/identity.controller")

const identityRouter = express.Router()

identityRouter.post("/register", registerUser)
identityRouter.post("/login", loginUser)
identityRouter.post("/refresh-token", refreshTokenUser)
identityRouter.post("/logout", logout)

module.exports = identityRouter
