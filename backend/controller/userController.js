const User = require("../models/UserModel");

const { generateToken } = require("../config/jwtToken"); // Import the generateToken function

const { generateRefreshToken } = require("../config/refreshToken"); // Import the generateRefreshToken function

const jwt = require("jsonwebtoken");

const createUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser) {
      const newUser = await User.create(req.body);
      return res.status(201).json({
        success: true,
        data: newUser,
      });
    } else {
      return res.status(409).json({
        success: false,
        message: "User is already registered",
      });
    }
  } catch (err) {
    // Pass error to the global error handler
    next(err);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email });
  if (!findUser) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }
  if (!(await findUser.isPasswordMatched(password))) {
    return res.status(401).json({
      success: false,
      message: "Incorrect password",
    });
  }
  const refreshToken = await generateRefreshToken(findUser._id); // Generate a refresh token
  const updateUser = await User.findByIdAndUpdate(
    findUser._id,
    { refreshToken: refreshToken }, // Update the user's refresh token
    { new: true }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // Set to true if using HTTPS
    // sameSite: "strict", // Adjust based on your requirements
    maxAge: 10 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    _id: findUser._id,
    name: findUser.name,
    email: findUser.email,
    mobile: findUser.mobile,
    token: generateToken(findUser._id), // generateToken is imported from jwtToken.js
    createdAt: findUser.createdAt,
    updatedAt: findUser.updatedAt,
  });
};

const handleRefreshToken = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token provided",
    });
  }

  const refreshToken = cookie.refreshToken;

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Refresh token not found, please login again",
      });
    }

    // Verify the token
    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      // Compare the user ID from DB with the decoded ID from token
      if (user._id.toString() !== decoded.id) {
        return res.status(403).json({
          success: false,
          message: "User ID mismatch in refresh token",
        });
      }

      const newAccessToken = generateToken(user._id);
      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies; // Get the refresh token from cookies
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "No refresh token provided",
    });
  }

  try {
    // Clear the refresh token in the database
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

    // Clear the cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      // sameSite: "strict", // Adjust based on your requirements
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    // Pass error to the global error handler
    next(err);
  }
};

// get signle user
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    // Pass error to the global error handler
    next(err);
  }
};

// delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    // Pass error to the global error handler
    next(err);
  }
};

// update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    // Pass error to the global error handler
    next(err);
  }
};

const blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    );
    if (user) {
      return res.status(200).json({
        success: true,
        message: "User blocked successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    // Pass error to the global error handler
    next(err);
  }
};
const unBlockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    );
    if (user) {
      return res.status(200).json({
        success: true,
        message: "User unblocked successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    // Pass error to the global error handler
    next(err);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user?._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  getCurrentUser,
};
