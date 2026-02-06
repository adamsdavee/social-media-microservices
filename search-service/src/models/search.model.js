const mongoose = require("mongoose")

const SearchModel = new mongoose.Schema(
   {
      postId: {
         type: String,
         required: true,
         unique: true,
      },
      userId: {
         type: String,
         required: true,
         unique: true,
      },
      content: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
   },
)

SearchModel.index({ content: "text" })
SearchModel.index({ createdAt: -1 })

const Search = mongoose.model("Search", SearchModel)

module.exports = Search
