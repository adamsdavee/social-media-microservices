const Search = require("../models/search.model")

async function handlePostCreated(event) {
   console.log(event)
   try {
      const { postId, userId, content } = event

      const newSearchPost = new Search({
         postId,
         userId,
         content,
      })

      await newSearchPost.save()

      logger.info(
         `Search post created: ${postId}, ${newSearchPost._id.toString()}`,
      )
   } catch (error) {
      logger("Error in handling post creation event ", error)
      res.status(500).json({
         success: false,
         message: "Error in handling post creation event",
      })
   }
}

module.exports = { handlePostCreated }
