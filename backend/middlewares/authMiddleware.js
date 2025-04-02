const jwt = require('jsonwebtoken');
const User = require('../models/userModel');  // No need for destructuring
const asyncHandler = require("express-async-handler");

//protect api from any unauthorised access
const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            console.log("Received Token:", token);

            //decode token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded JWT:", decoded);

            req.user = await User.findById(decoded.id).select("-password");
            console.log("Authenticated User:", req.user);

            next();

        } catch (error) {
            console.error("JWT Verification Failed:", error.message);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
    if (!token) {
        console.error("No Token Provided");
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = { protect };
