const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Not authorized, token expired. Login again.",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  }
};

const isAdmin = async (req, res, next) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (user && user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied, admin only",
    });
  } else {
    next();
  }
};

module.exports = { authMiddleware, isAdmin };
