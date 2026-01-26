const mongoose = require("mongoose")

const PostModel = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },

      content: {
         type: String,
         required: true,
      },

      mediaIds: [
         {
            type: String,
         },
      ],
   },
   {
      timestamps: true,
   },
)

PostModel.index({ content: "text" })

const Post = mongoose.model("Post", PostModel)

module.exports = Post
