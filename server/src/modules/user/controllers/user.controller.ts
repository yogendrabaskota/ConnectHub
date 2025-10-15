import User from "../models/user.model";
import { Request, Response } from "express";
import jwtToken from "../utils/token";

class UserController {
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, phone, name, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          message: "User already exists",
        });
        return;
      }
      const newUser = new User({
        email,
        phoneNum: phone,
        name,
        password,
        role,
      });
      await newUser.save();
      res.status(201).json({
        message: "User registered successfully",
        user: newUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error,
      });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      // const userId = req.params.id;
      const user = await User.find().select("-password -otp -isOtpVerified");
      if (user.length === 0 || !user) {
        res.status(404).json({
          message: "User not found",
        });
        return;
      }
      res.status(200).json({
        message: "User fetched successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error,
      });
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select(
        "+password +isOtpVerified"
      );
      if (!user) {
        res.status(400).json({
          message: "Invalid email or password",
        });
        return;
      }
      if (user.password !== password) {
        res.status(400).json({
          message: "Invalid email or password",
        });
        return;
      }
      const token = jwtToken(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "secret",
        "7d"
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error,
      });
    }
  }
}
export default new UserController();
