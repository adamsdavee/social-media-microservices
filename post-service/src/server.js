require("dotenv").config()
const express = require("express")
const postRouter = require("./routes/post.route")
const errorHandler = require("./middlewares/errorHandler")
const connectToMongoDB = require("./db/connectToMongoDb")
const cors = require("cors")
const helmet = require("helmet")
const logger = require("./utils/logger")
const Redis = require("ioredis")
const { connectToRabbitMQ } = require("./utils/rabbitmq")

const app = express()
const PORT = process.env.PORT || 3002

connectToMongoDB()

const redisClient = new Redis(process.env.REDIS_URL)

// middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
   logger.info(`Received ${req.method} request to ${req.url}`)
   logger.info(`Request body: ${req.body}`)

   next()
})

// Implement sensitive IP based rate limiting later

app.use(
   "/api/post",
   (req, res, next) => {
      req.redisClient = redisClient

      next()
   },
   postRouter,
)

app.get("/", (req, res) => {
   res.send("It is working")
})

app.use(errorHandler)

async function startServer() {
   try {
      await connectToRabbitMQ()

      app.listen(PORT, () => {
         logger.info(`Post service running at port: ${PORT}`)
      })
   } catch (error) {
      logger.error("Failed to connect to server: ", error)
      process.exit(1)
   }
}

startServer()

process.on("unhandledRejection", (reason, promise) => {
   logger.error(`Unhandled rejection at ${promise} reason: ${reason}`)
})
