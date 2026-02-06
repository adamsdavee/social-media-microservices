const express = require("express")
const {
   createPost,
   getAllPosts,
   getPost,
   deletePost,
} = require("../controllers/post.controller")
const { authenticateRequest } = require("../middlewares/auth.middleware")

const postRouter = express.Router()

postRouter.use(authenticateRequest)

postRouter.post("/create-post", createPost)
postRouter.get("/get-post", getAllPosts)
postRouter.get("/:id", getPost)
postRouter.delete("/:id", deletePost)

module.exports = postRouter
