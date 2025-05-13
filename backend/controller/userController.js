const User = require("../models/UserModel");

const createUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        const findUser = await User.findOne({ email });

        if (!findUser) {
            const newUser = await User.create(req.body);
            return res.status(201).json({
                success: true,
                data: newUser
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

module.exports = { createUser };
