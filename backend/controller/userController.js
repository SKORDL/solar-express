const User = require("../models/UserModel");

const { generateToken } = require("../config/jwtToken"); // Import the generateToken function

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
        msg: "User is already registered",
      });
    }
  } catch (err) {
    // Pass error to the global error handler
    next(err);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //finding particular user
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    return res.status(200).json({
      success: true,
      msg: "Login successful",
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      mobile: findUser.mobile,
      token: generateToken(findUser._id), // generateToken is imported from jwtToken.js
      createdAt: findUser.createdAt,
      updatedAt: findUser.updatedAt,
    });
  } else {
    return res.status(401).json({
      success: false,
      msg: "Invalid email or password",
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
        msg: "User not found",
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
        msg: "User deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "User not found",
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
        msg: "User not found",
      });
    }
  } catch (err) {
    // Pass error to the global error handler
    next(err);
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
};
