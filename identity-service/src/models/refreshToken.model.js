const mongoose = require("mongoose")

const RefreshTokenModel = new mongoose.Schema(
   {
      token: {
         type: String,
         required: true,
         unique: true,
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      expiredAt: {
         type: Date,
         required: true,
      },
   },
   {
      timestamps: true,
   },
)

RefreshTokenModel.index({ expiredAt: 1 }, { expireAfterSeconds: 0 })

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenModel)

module.exports = RefreshToken
