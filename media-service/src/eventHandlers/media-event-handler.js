const Media = require("../models/media.model")
const { deleteMediaFromCloudinary } = require("../utils/cloudinary")
const logger = require("../utils/logger")

const handlePostDeleted = async (event) => {
   console.log(event, "eventeventevent")

   try {
      const { postId, userId, mediaIds } = event

      const mediaToDelete = await Media.find({ _id: { $in: mediaIds } })

      for (const media of mediaToDelete) {
         await deleteMediaFromCloudinary(media.publicId)
         await Media.findByIdAndDelete(media._id)

         logger.info(`Deleted media ${media.id} associated with post ${postId}`)
      }

      // Rather than having many db calls, you can just delete all the documents once
      // await Media.deleteMany({_id: {$in: mediaIds}})

      logger.info("Deletion of media for postId ", postId)
   } catch (error) {
      logger.error("Error occuured while deleting media: ", error)
   }
}

module.exports = { handlePostDeleted }
