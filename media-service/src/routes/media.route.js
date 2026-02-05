const express = require("express")
const multer = require("multer")

const { uploadMedia, getAllMedias } = require("../controllers/media.controller")
const { authenticateRequest } = require("../middlewares/auth.middleware")

const mediaRouter = express.Router()

// configure multer for file upload
const upload = multer({
   storage: multer.memoryStorage(),
   limits: {
      fileSize: 5 * 1024 * 1024,
   },
}).single("file")

mediaRouter.use(authenticateRequest)

mediaRouter.post(
   "/upload",
   authenticateRequest,
   (req, res, next) => {
      upload(req, res, function (err) {
         if (err instanceof multer.MulterError) {
            logger.error("Multer error while uploading: ", err)
            return res.status(400).json({
               success: false,
               message: "Multer error while uploading: ",
               error: err.message,
               stack: err.stack,
            })
         } else if (err instanceof multer.MulterError) {
            logger.error("Unknown error while uploading: ", err)
            return res.status(400).json({
               success: false,
               message: "Unknown error while uploading: ",
               error: err.message,
               stack: err.stack,
            })
         }

         if (!req.file) {
            res.status(500).json({
               success: false,
               message: "No file found",
            })
         }

         next()
      })
   },
   uploadMedia,
)

mediaRouter.get("/get", authenticateRequest, getAllMedias)

module.exports = mediaRouter
