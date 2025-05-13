const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const { errorMiddleware } = require("./error/error");

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
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"],
  })
); // Handle CORS

app.use(morgan("dev")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", homePageRouter);
app.use("/api/user", authRouter);
app.use("/api/products", productRoute);
app.use("/api/brands", brandRoute);
app.use("/api/category", categoryRoute);

dbConnect();

app.use(errorMiddleware);

module.exports = app;
