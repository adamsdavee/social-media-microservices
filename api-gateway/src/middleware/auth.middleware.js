const logger = require("../utils/logger")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// This makes it that there is only a single auth in all the microservice
// which is in this api gateway whilst other services just trust that the gateway has validated the user

const validateToken = (req, res, next) => {
   const authHeader = req.headers["authorization"]
   const token = authHeader && authHeader.split(" ")[1]

   if (!token) {
      logger.warn("Access attempt without valid token!")
      return res.status(401).json({
         success: false,
         message: "Authentication required",
      })
   }

   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
         logger.warn("Invalid token!")
         return res.status(429).json({
            success: false,
            message: "Invalid token",
         })
      }

      req.user = user

      next()
   })
}

module.exports = { validateToken }
