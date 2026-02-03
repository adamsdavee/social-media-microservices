const Post = require("../models/post.model")
const logger = require("../utils/logger")
const { validateCreatePost } = require("../utils/validation")

const invalidatePostCache = async (req, input) => {
   const cachedKey = `post:${input}`
   await req.redisClient.del(cachedKey)

   const keys = await req.redisClient.keys("posts:*")
   if (keys.length > 0) {
      await req.redisClient.del(keys)
   }
}

const createPost = async (req, res) => {
   logger.info("Create post endpoint hit...")
   try {
      const { error } = validateCreatePost(req.body)
      if (error) {
         logger.warn(`Validation error`, error.details[0].message)
         return res.status(400).json({
            success: false,
            message: error.details[0].message,
         })
      }

      const { content, mediaIds } = req.body

      const newPost = new Post({
         user: req.user.userId,
         content,
         mediaIds: mediaIds || [],
      })
      await newPost.save()

      await invalidatePostCache(req, newPost._id.toString())

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
   logger.info("Get all post endpoint hit...")
   try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.page) || 10
      const startIndex = (page - 1) * limit

      const cachedKey = `posts:${page}:${limit}`
      const cachedPosts = await req.redisClient.get(cachedKey)
      console.log(cachedPosts)

      if (cachedPosts) {
         return res.json(JSON.parse(cachedPosts))
      }

      const posts = await Post.find({})
         .sort({ createdAt: -1 })
         .skip(startIndex)
         .limit(limit)

      const totalNoOfPosts = await Post.countDocuments()

      const results = {
         posts,
         currentPage: page,
         totalPages: Math.ceil(totalNoOfPosts / limit),
         totalNoOfPosts: totalNoOfPosts,
      }

      // save post to redis cache
      await req.redisClient.setex(cachedKey, 300, JSON.stringify(results))

      res.json(results)
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
      const postId = req.params.id
      const cachedKey = `post:${postId}`
      const cachedPost = await req.redisClient.get(cachedKey)

      if (cachedPost) {
         return res.json(JSON.parse(cachedPost))
      }

      const postDetailsById = await Post.findById(postId)

      if (!postDetailsById) {
         return res.status(404).json({
            success: false,
            message: "Post not found",
         })
      }

      await req.redisClient.setex(
         cachedKey,
         300,
         JSON.stringify(postDetailsById),
      )

      res.json(postDetailsById)
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
      const { id } = req.params
      if (!id) {
         return res.status(404).json({
            success: false,
            message: "ID not found",
         })
      }

      // Why we are using find one and delete is to ensure that it is the user that is
      // deleting his/her post
      const deletedPost = await Post.findOneAndDelete({
         _id: id,
         user: req.user.userId,
      })
      if (!deletedPost) {
         return res.status(404).json({
            success: false,
            message: "Post not found",
         })
      }

      await invalidatePostCache(req, id)

      res.json({
         success: true,
         message: "Post deleted successfully",
         deletedPost,
      })
   } catch (error) {
      logger.error("Error deleting post", error)
      res.status(500).json({
         success: false,
         message: "Error deleting post",
      })
   }
}

module.exports = { createPost, getAllPosts, getPost, deletePost }
