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
   try {
   } catch (error) {
      logger.error("Error getting all posts", error)
      res.status(500).json({
         success: false,
         message: "Error getting all post",
      })
   }
}

const getPost = async (req, res) => {
   try {
   } catch (error) {
      logger.error("Error getting post", error)
      res.status(500).json({
         success: false,
         message: "Error getting post",
      })
   }
}

const deletePost = async (req, res) => {
   try {
   } catch (error) {
      logger.error("Error deleting post", error)
      res.status(500).json({
         success: false,
         message: "Error deleting post",
      })
   }
}

module.exports = { createPost, getAllPosts, getPost, deletePost }
