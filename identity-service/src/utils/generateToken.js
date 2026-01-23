const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const RefreshToken = require("../models/refreshToken.model")
require("dotenv").config()

const generateTokens = async (user) => {
   const accessToken = jwt.sign(
      {
         userId: user._id,
         username: user.username,
      },
      process.env.JWY_SECRET,
      {
         expiresIn: "60m",
      },
   )

   const refreshToken = crypto.randomBytes(40).toString("hex")
   const expiresAt = new Date()
   expiresAt.setDate(expiresAt.getDate() + 7) // expires in 7 days

   await RefreshToken.create({
      token: accessToken,
      userId: user._id,
      expiredAt: expiresAt,
   })

   return { accessToken, refreshToken }
}

module.exports = { generateTokens }
