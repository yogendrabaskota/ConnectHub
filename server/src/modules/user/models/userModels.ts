import mongoose, { Document, Schema, Model } from "mongoose";

// Define an interface for the User document
export interface IUser extends Document {
  email: string;
  phoneNum: string;
  name: string;
  password: string;
  role: "customer" | "admin";
  otp?: number;
  isOtpVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create the schema
const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, "userEmail must be provided"],
      unique: true,
      lowercase: true,
    },
    phoneNum: {
      type: String,
      required: [true, "userPhoneNumber must be provided"],
    },
    name: {
      type: String,
      required: [true, "userName must be provided"],
    },
    password: {
      type: String,
      required: [true, "userPassword must be provided"],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    otp: {
      type: Number,
      select: false,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

// Create and export the model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
