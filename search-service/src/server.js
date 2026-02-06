require("dotenv").config()
const express = require("express")
const errorHandler = require("./middlewares/errorHandler")
const connectToMongoDB = require("./db/connectToMongoDb")
const cors = require("cors")
const helmet = require("helmet")
const logger = require("./utils/logger")
const Redis = require("ioredis")
const { connectToRabbitMQ, consumeEvent } = require("./utils/rabbitmq")
const searchRouter = require("./routes/search.route")
const {
   handlePostCreated,
   handlePostDeleted,
} = require("./eventHandlers/search.event.handler")

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

// implement redis caching

app.use("/api/search", searchRouter)

app.get("/", (req, res) => {
   res.send("It is working")
})

app.use(errorHandler)

async function startServer() {
   try {
      await connectToRabbitMQ()

      // consume the events / subscribe to events

      await consumeEvent("post.created", handlePostCreated)

      await consumeEvent("post.deleted", handlePostDeleted)

      app.listen(PORT, () => {
         logger.info(`Search service running at port: ${PORT}`)
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
