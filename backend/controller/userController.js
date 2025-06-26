const Product = require("../models/ProductsModel");
const User = require("../models/UserModel");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// CREATE USER
const createUser = asyncHandler(async (req, res) => {
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
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
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
  const refreshToken = await generateRefreshToken(findUser._id);
  await User.findByIdAndUpdate(
    findUser._id,
    { refreshToken: refreshToken },
    { new: true }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  res.cookie("accessToken", generateToken(findUser._id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    _id: findUser._id,
    name: findUser.name,
    email: findUser.email,
    mobile: findUser.mobile,
    token: generateToken(findUser._id),
    createdAt: findUser.createdAt,
    updatedAt: findUser.updatedAt,
  });
});

// REFRESH TOKEN
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token provided",
    });
  }

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(403).json({
      success: false,
      message: "Refresh token not found, please login again",
    });
  }

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
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
});

// LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "No refresh token provided",
    });
  }
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// GET ALL USERS
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  return res.status(200).json({
    success: true,
    data: users,
  });
});

// GET SINGLE USER
const getSingleUser = asyncHandler(async (req, res) => {
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
});

// DELETE USER
const deleteUser = asyncHandler(async (req, res) => {
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
});

// UPDATE USER
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
});

// BLOCK USER
const blockUser = asyncHandler(async (req, res) => {
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
});

// UNBLOCK USER
const unBlockUser = asyncHandler(async (req, res) => {
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
});

// GET CURRENT USER
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, user });
});

// GET USER'S CART
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "cart.product",
    select: "name price images slug variants",
  });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, cart: user.cart });
});

// ADD PRODUCT TO CART
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity = 1, label } = req.body;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // Find user
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Check if product (with variant) already in cart
  const existing = user.cart.find(
    (item) =>
      item.product.toString() === productId &&
      (label ? item.label === label : true)
  );

  if (existing) {
    // Update quantity
    existing.quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity, label });
  }

  await user.save();

  // Fetch user again and populate product details
  const populatedUser = await User.findById(userId).populate({
    path: "cart.product",
    select: "name price images slug variants",
  });

  res.json({ success: true, cart: populatedUser.cart });
});

// UPDATE CART ITEM
const updateCartItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { cartItemId, quantity, selectedVariant } = req.body;

  const item = user.cart.id(cartItemId);
  if (!item) return res.status(404).json({ message: "Cart item not found" });

  if (quantity !== undefined) item.quantity = quantity;
  if (selectedVariant !== undefined) item.selectedVariant = selectedVariant;

  await user.save();

  // Fetch user again and populate product details
  const populatedUser = await User.findById(req.user._id).populate({
    path: "cart.product",
    select: "name price images slug variants",
  });

  res.json({ success: true, cart: populatedUser.cart });
});

// REMOVE ITEM FROM CART
const removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { cartItemId } = req.body;

  user.cart = user.cart.filter((item) => item._id.toString() !== cartItemId);
  await user.save();

  // Fetch user again and populate product details
  const populatedUser = await User.findById(req.user._id).populate({
    path: "cart.product",
    select: "name price images slug variants",
  });

  res.json({ success: true, cart: populatedUser.cart });
});

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
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
};
