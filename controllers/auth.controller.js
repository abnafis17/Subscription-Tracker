import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password } = req.body;

    // Validate user input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );

    // Generate JWT token
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: {
        user: newUsers[0],
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// export const signIn = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // Validate user input
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields.",
//       });
//     }

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password.",
//       });
//     }

//     // Check if password is correct
//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password.",
//       });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, {
//       expiresIn: JWT_EXPIRES_IN,
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         user,
//         token,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const signOut = (req, res) => {
//   // For JWT, sign-out is typically handled on the client side by deleting the token.
//   res.status(200).json({
//     success: true,
//     message: "User signed out successfully.",
//   });
// };
