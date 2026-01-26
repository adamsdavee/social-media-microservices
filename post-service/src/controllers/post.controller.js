const Post = require("../models/post.model")
const logger = require("../utils/logger")

const createPost = async (req, res) => {
   try {
      const { content, mediaIds } = req.body

      const newPost = await new Post({
         user: req.user.userId,
         content,
         mediaIds: mediaIds || [],
      })
      await newPost.save()

      logger.info("Post created successfully", newPost)

      res.status(201).json({
         success: true,
         message: "Post created successfully",
      })
   } catch (error) {
      logger.error("Error creating posts", error)
      res.status(500).json({
         success: false,
         message: "Error creating post",
      })
   }
}

const getAllPosts = async (req, res) => {
   logger.info("Get all post endpoint reached...")

   try {
   } catch (error) {
      logger.error("Error getting all posts", error)
      res.status(500).json({
         success: false,
         message: "Error getting all post",
      })
   }
}

module.exports = { createPost, getAllPosts }
