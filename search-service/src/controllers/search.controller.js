const Search = require("../models/search.model")
const logger = require("../utils/logger")

const searchPostController = async (req, res) => {
   try {
      const { query } = req.query

      const results = Search.find(
         {
            $text: { $search: query },
         },
         {
            score: { $meta: "textScore" },
         },
      )
         .sort({ score: { $meta: "textScore" } })
         .limit(10)
   } catch (error) {
      logger("Error while searching post ", error)
      res.status(500).json({
         success: false,
         message: "Error while searching post",
      })
   }
}
