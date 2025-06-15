const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const { errorMiddleware } = require("./error/error");

const cookieParser = require("cookie-parser");

const dbConnect = require("./database/dbConnect");

dotenv.config();

//Routers
const homePageRouter = require("./routes/homePageRoute");
const authRouter = require("./routes/auhtRoute");
const productRoute = require("./routes/productRoute");
const brandRoute = require("./routes/brandRoute");
const categoryRoute = require("./routes/categoryRoute");

const app = express();

dotenv.config({ path: "./config/config.env" });

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
); // Security headers with CORS support

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001", // Default to localhost for development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
); // Handle CORS

app.use(morgan("dev")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", homePageRouter);
app.use("/api/user", authRouter);
app.use("/api/products", productRoute);
app.use("/api/brands", brandRoute);
app.use("/api/category", categoryRoute);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

dbConnect();

app.use(errorMiddleware);

module.exports = app;
