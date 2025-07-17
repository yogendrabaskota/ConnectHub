
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: String,

  senderId: String,

  receiverId: String,

  text: String,

  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Message = mongoose.model("Message", messageSchema);
