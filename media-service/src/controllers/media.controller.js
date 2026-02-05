const Media = require("../models/media.model")
const { uploadMediaToCloudinary } = require("../utils/cloudinary")
const logger = require("../utils/logger")

const uploadMedia = async (req, res) => {
   try {
      logger.info("Starting media upload")

      if (!req.file) {
         logger.error("No file found. Please add file and try again")
         return res.status(400).json({
            success: false,
            message: "No file found. Please add file and try again",
         })
      }

      const { originalname, mimetype, buffer } = req.file
      const userId = req.user.userId

      logger.info(`File details: name=${originalname}, type=${mimetype}`)
      logger.info("Uploading to cloudinary starting...")

      const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file)
      console.log(cloudinaryUploadResult)
      logger.info(
         `Cloudinary upload successful. Public Id: ${cloudinaryUploadResult.public_id}`,
      )

      const newMedia = Media({
         publicId: cloudinaryUploadResult.public_id,
         originalName: originalname,
         mimeType: mimetype,
         url: cloudinaryUploadResult.secure_url,
         user: userId,
      })

      await newMedia.save()

      res.status(201).json({
         success: true,
         mediaId: newMedia._id,
         url: newMedia.url,
         message: "Media upload is successful",
      })
   } catch (error) {
      logger.error("Error while uploading to cloudinary")
      res.status(500).json({
         success: false,
         message: "Internal server error while uploading to cloudinary",
      })
   }
}

module.exports = { uploadMedia }
