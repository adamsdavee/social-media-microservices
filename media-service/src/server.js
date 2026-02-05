require("dotenv").config()
const express = require("express")
const mediaRouter = require("./routes/media.route")
const errorHandler = require("./middlewares/errorHandler")
const connectToMongoDB = require("./db/connectToMongoDb")
const cors = require("cors")
const helmet = require("helmet")
const logger = require("./utils/logger")
const Redis = require("ioredis")

const app = express()
const PORT = process.env.PORT || 3003

connectToMongoDB()

// const redisClient = new Redis(process.env.REDIS_URL)

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

app.use("/api/media", mediaRouter)

app.get("/", (req, res) => {
   res.send("It is working")
})

app.use(errorHandler)

app.listen(PORT, () => {
   logger.info(`Post service running at port: ${PORT}`)
})

process.on("unhandledRejection", (reason, promise) => {
   logger.error(`Unhandled rejection at ${promise} reason: ${reason}`)
})
