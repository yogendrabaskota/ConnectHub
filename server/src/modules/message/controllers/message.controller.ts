import { Request, Response } from "express";
import Message from "../models/message.model";
import { AuthRequest } from "../../../middlewares/auth.middleware";

class MessageController {
  async createMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { receiver, content } = req.body;
      const newMessage = new Message({
        sender: userId,
        receiver,
        content,
      });
      await newMessage.save();
      res.status(201).json({
        message: "Message sent successfully",
        data: newMessage,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error,
      });
    }
  }

  // get all messages between two users
  async getMessages(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId1 = req.user?._id;
      const { userId2 } = req.params;

      console.log("userId1", userId1);
      console.log("userId2", userId2);
      // Find messages where (sender is userId1 and receiver is userId2) or (sender is userId2 and receiver is userId1)
      const messages = await Message.find({
        $or: [
          { sender: userId1, receiver: userId2 },
          { sender: userId2, receiver: userId1 },
        ],
      })
        .sort({ createdAt: 1 }) // Sort by creation time ascending
        .select("-isDeleted")
        .populate("sender", "name email")
        .populate("receiver", "name email");
      if (messages.length === 0) {
        res.status(404).json({ message: "No messages found" });
        return;
      }

      res.status(200).json({
        message: "Messages retrieved successfully",
        messages,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error,
      });
    }
  }

  // mark a message as read
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;
      const message = await Message.findByIdAndUpdate(
        messageId,
        { isRead: true },
        { new: true }
      );
      if (!message) {
        res.status(404).json({
          message: "Message not found",
        });
        return;
      }
      res.status(200).json({
        message: "Message marked as read",
        data: message,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error,
      });
    }
  }

  async hardDeleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;
      const message = await Message.findByIdAndDelete(messageId);
      if (!message) {
        res.status(404).json({ message: "Message not found" });
        return;
      }
      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  async softDeleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;
      const message = await Message.findByIdAndUpdate(
        messageId,
        { isDeleted: true },
        { new: true }
      );
      if (!message) {
        res.status(404).json({ message: "Message not found" });
        return;
      }
      res
        .status(200)
        .json({ message: "Message soft deleted successfully", data: message });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // get messages sent to me from one user
  async getMyMessageFromOneUser(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const senderId = req.params.senderId;
      const receiverId = req.user?._id;
      console.log("senderId", senderId);
      console.log("receiverId", receiverId);
      const messages = await Message.find({
        sender: senderId,
        receiver: receiverId,
      }).sort({ createdAt: 1 });
      //   console.log("messages", messages);
      if (messages.length === 0) {
        res.status(404).json({ message: "No messages found" });
        return;
      }
      res.status(200).json({
        message: "Messages retrieved successfully",
        messages,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
}

export default new MessageController();
