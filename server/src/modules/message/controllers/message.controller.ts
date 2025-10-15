import { Request, Response } from "express";
import Message from "../models/message.model";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import redis from "../../../config/redis";

class MessageController {
  // create message
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

      // Invalidate cache for this conversation
      const conversationKey = `messages:${[userId, receiver].sort().join(":")}`;
      await redis.del(conversationKey);

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

  // get all messages between two users with Redis caching
  async getMessages(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId1 = req.user?._id;
      const { userId2 } = req.params;

      const conversationKey = `messages:${[userId1, userId2].sort().join(":")}`;

      // Try to get messages from Redis
      const cachedMessages = await redis.get(conversationKey);
      if (cachedMessages) {
        res.status(200).json({
          message: "Messages retrieved successfully (from cache)",
          messages: JSON.parse(cachedMessages),
        });
        return;
      }

      // If not cached, fetch from MongoDB
      const messages = await Message.find({
        $or: [
          { sender: userId1, receiver: userId2 },
          { sender: userId2, receiver: userId1 },
        ],
      })
        .sort({ createdAt: 1 })
        .select("-isDeleted")
        .populate("sender", "name email")
        .populate("receiver", "name email");

      if (messages.length === 0) {
        res.status(404).json({ message: "No messages found" });
        return;
      }

      // Store in Redis cache for future requests (expire in 60 seconds)
      await redis.set(conversationKey, JSON.stringify(messages), "EX", 60);

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

      // Invalidate conversation cache
      const conversationKey = `messages:${[message.sender, message.receiver]
        .sort()
        .join(":")}`;
      await redis.del(conversationKey);

      res.status(200).json({
        message: "Message marked as read",
        data: message,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // hard delete a message
  async hardDeleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;
      const message = await Message.findByIdAndDelete(messageId);

      if (!message) {
        res.status(404).json({
          message: "Message not found",
        });
        return;
      }

      // Invalidate conversation cache
      const conversationKey = `messages:${[message.sender, message.receiver]
        .sort()
        .join(":")}`;
      await redis.del(conversationKey);

      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // soft delete a message
  async softDeleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;
      const message = await Message.findByIdAndUpdate(
        messageId,
        { isDeleted: true },
        { new: true }
      );

      if (!message) {
        res.status(404).json({
          message: "Message not found",
        });
        return;
      }

      // Invalidate conversation cache
      const conversationKey = `messages:${[message.sender, message.receiver]
        .sort()
        .join(":")}`;
      await redis.del(conversationKey);

      res
        .status(200)
        .json({ message: "Message soft deleted successfully", data: message });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // get messages sent to me from one user with caching
  async getMyMessageFromOneUser(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const senderId = req.params.senderId;
      const receiverId = req.user?._id;

      const conversationKey = `messages:${[senderId, receiverId]
        .sort()
        .join(":")}`;

      // Try to fetch from cache
      const cachedMessages = await redis.get(conversationKey);
      if (cachedMessages) {
        res.status(200).json({
          message: "Messages retrieved successfully (from cache)",
          messages: JSON.parse(cachedMessages),
        });
        return;
      }

      const messages = await Message.find({
        sender: senderId,
        receiver: receiverId,
      }).sort({ createdAt: 1 });

      if (messages.length === 0) {
        res.status(404).json({
          message: "No messages found",
        });
        return;
      }

      await redis.set(conversationKey, JSON.stringify(messages), "EX", 60);

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
