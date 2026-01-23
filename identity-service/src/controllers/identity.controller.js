const User = require("../models/user.model")
const logger = require("../utils/logger")
const { validateRegistration } = require("../utils/validation")

// user registration

const registerUseer = async (req, res) => {
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
   } catch (e) {}
}

// user login

// refresh token

// logout
