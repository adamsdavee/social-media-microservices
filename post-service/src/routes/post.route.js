const express = require("express")
const {
   createPost,
   getAllPosts,
   getPost,
   deletePost,
} = require("../controllers/post.controller")
const { authenticateRequest } = require("../middlewares/auth.middleware")

const postRouter = express.Router()

// Because all the functions in the controller will require authentication of
// requests rather than passing the auth request the normal way we do it like this so that every
// request that comes into this route will first pass through the authenticateRequest middleware

postRouter.use(authenticateRequest)

postRouter.post("/create-post", createPost)
postRouter.get("/get-post", getAllPosts)
postRouter.get("/:id", getPost)
postRouter.delete("/:id", deletePost)

module.exports = postRouter
