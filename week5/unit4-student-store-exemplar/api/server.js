const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { PORT } = require("./config")
const { NotFoundError } = require("./utils/errors")
const security = require("./middleware/security")
const productRoutes = require("./routes/products")
const orderRoutes = require("./routes/orders")
const orderItemRoutes = require("./routes/orderItems")
const authRoutes = require("./routes/auth")

const app = express()

// Enable cross-origin resource sharing so the React frontend (a different
// origin/port) can call this API. In production, restrict this to the frontend
// origin instead of allowing all origins.
app.use(cors())
// Parse incoming requests with JSON payloads.
app.use(express.json())
// Log request info.
app.use(morgan("tiny"))

// Extract the user from the JWT (if present) and attach to res.locals.user.
app.use(security.extractUserFromJwt)

// Root route — quick health check.
app.get("/", (req, res) => {
  return res.status(200).json({ ping: "pong", message: "Welcome to the Student Store API!" })
})

app.use("/products", productRoutes)
app.use("/orders", orderRoutes)
app.use("/order-items", orderItemRoutes)
app.use("/auth", authRoutes)

/** Handle 404 errors — this matches everything not handled above. */
app.use((req, res, next) => {
  return next(new NotFoundError())
})

/** Generic error handler; anything unhandled ends up here. */
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || "Something went wrong on our end."

  return res.status(status).json({
    error: { message, status },
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

module.exports = app
