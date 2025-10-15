import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { IUser } from "../../user/models/user.model"; // Adjust the path as needed

// Define an interface for the Message document
export interface IMessage extends Document {
  sender: Types.ObjectId; // Reference to sender (User)
  receiver: Types.ObjectId; // Reference to receiver (User)
  content: string; // Message text
  isRead: boolean; // Message read status
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean; // Message deletion status
}

// Create the schema
const messageSchema: Schema<IMessage> = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Message content must be provided"],
    },

    isRead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create and export the model
const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  messageSchema
);
export default Message;
