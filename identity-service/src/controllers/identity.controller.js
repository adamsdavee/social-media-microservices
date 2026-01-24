const User = require("../models/user.model")
const logger = require("../utils/logger")
const { validateRegistration, validateLogin } = require("../utils/validation")
const { generateTokens } = require("../utils/generateToken")
const RefreshToken = require("../models/refreshToken.model")

// user registration

const registerUser = async (req, res) => {
   logger.info("Registration endpoint hit...")

   try {
      // validate schema
      const { error } = validateRegistration(req.body)
      console.log(error)
      if (error) {
         logger.warn("Validation error", error.details[0].message)
         return res.status(400).json({
            success: false,
            message: error.details[0].message,
         })
      }

      const { username, email, password } = req.body

      let user = await User.findOne({
         $or: [{ email }, { username: username }],
      })

      if (user) {
         logger.warn("User already exists..")
         return res.status(400).json({
            success: false,
            message: "User already exists",
         })
      }

      user = await User({
         username: username,
         email: email,
         password: password,
      })

      await user.save()

      logger.info("User saved successfully", user._id)

      const { accessToken, refreshToken } = await generateTokens(user)

      res.status(201).json({
         success: true,
         message: "User registered successfully!",
         accessToken,
         refreshToken,
      })
   } catch (e) {
      logger.error("Registration error occured!")
      res.status(500).json({
         success: false,
         message: "Internal server error",
      })
   }
}

// user login

const loginUser = async (req, res) => {
   logger.info("Login endpoint hit...")
   try {
      const { error } = validateLogin(req.body)
      if (error) {
         logger.warn(`Validation error`, error.details[0].message)
         return res.status(400).json({
            success: false,
            message: error.details[0].message,
         })
      }

      const { email, password } = req.body
      const user = await User.findOne({ email: email })

      if (!user) {
         logger.warn("Invalid user")
         return res.status(400).json({
            success: false,
            message: "Invalid credentials",
         })
      }

      const isValidPassword = await user.comparePassword(password)

      if (!isValidPassword) {
         logger.warn("Invalid password")
         return res.status(400).json({
            success: false,
            message: "Invalid password",
         })
      }

      const { accessToken, refreshToken } = await generateTokens(user)

      res.status(200).json({
         success: true,
         accessToken,
         refreshToken,
         userId: user._id,
      })
   } catch (error) {
      logger.error("Login error occured!")
      res.status(500).json({
         success: false,
         message: "Internal server error",
      })
   }
}
// refresh token

const refreshTokenUser = async (req, res) => {
   logger.info("Refresh token endpoint hit...")
   try {
      const { refreshToken } = req.body
      if (!refreshToken) {
         logger.warn("Refresh token not found")
         res.status(400).json({
            success: false,
            message: "Refresh token missing",
         })
      }

      const userRefreshToken = await RefreshToken.findOne({
         token: refreshToken,
      })
      if (!userRefreshToken || userRefreshToken.expiredAt < new Date()) {
         logger.warn("Invalid or expired refresh token")
         console.log(new Date())
         res.status(400).json({
            success: false,
            message: "Invalid or expired refresh token",
         })
      }

      const user = await User.findById(userRefreshToken._id)

      if (!user) {
         logger.warn("User not found")
         res.status(400).json({
            success: false,
            message: "User not found",
         })
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
         await generateTokens(user)

      // delete the old refresh token
      await RefreshToken.deleteOne({ _id: userRefreshToken._id })

      res.status(200).json({
         success: false,
         newAccessToken,
         newRefreshToken,
      })
   } catch (error) {
      logger.warn("Refresh token generation error occured")
      res.status(500).json({
         success: false,
         message: "Internal server error occured",
      })
   }
}

// logout

const logout = async (req, res) => {
   logger.info("Logout endpoint hit...")

   try {
      const { refreshToken } = req.body
      if (!refreshToken) {
         logger.warn("Refresh token not found")
         res.status(400).json({
            success: false,
            message: "Refresh token missing",
         })
      }

      await RefreshToken.deleteOne({ token: refreshToken })
      logger.info("Refresh token deleted for logout")

      res.status(200).json({
         success: false,
         message: "Logged out successfully",
      })
   } catch (error) {
      logger.warn("Error in logging out")
      res.status(500).json({
         success: false,
         message: "Internal server error occured",
      })
   }
}

module.exports = { registerUser, loginUser, refreshTokenUser, logout }
