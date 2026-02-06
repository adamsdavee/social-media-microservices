const Search = require("../models/search.model")
const logger = require("../utils/logger")

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
      logger.error("Error in handling post creation event ", error)
      throw error
   }
}

async function handlePostDeleted(event) {
   console.log(event)
   try {
      const { postId } = event

      await Search.findOneAndDelete({ postId: postId })

      logger.info(`Search post deleted: ${postId}`)
   } catch (error) {
      logger.error("Error in handling post deletion event ", error)
      throw error
   }
}

module.exports = { handlePostCreated, handlePostDeleted }
