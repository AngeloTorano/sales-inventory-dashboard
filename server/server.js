const express = require("express")
const path = require("path")
const cors = require("cors")
const apiRoutes = require("./routes/api")
const db = require("./db")

// Create Express app
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files
app.use(express.static(path.join(__dirname, "../public")))

// API routes
app.use("/api", apiRoutes)

// Catch-all route to serve the main HTML file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// Initialize database connection and start server
db.init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Dashboard available at http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err)
    process.exit(1)
  })

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...")
  db.close()
    .then(() => {
      console.log("Database connection closed")
      process.exit(0)
    })
    .catch((err) => {
      console.error("Error closing database connection:", err)
      process.exit(1)
    })
})
