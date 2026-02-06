async function handlePostCreated() {
   try {
   } catch (error) {
      logger("Error in handling post creation event ", error)
      res.status(500).json({
         success: false,
         message: "Error in handling post creation event",
      })
   }
}
