import express, { Router } from "express";
import messageController from "../controllers/message.controller";
import { validate } from "../../../middlewares/validate";
import { sendMessageSchema } from "../utils/message.validation";
import authMiddleware from "../../../middlewares/auth.middleware";

const router: Router = express.Router();

// Send a message
router
  .route("/send")
  .post(
    authMiddleware.isAuthenticated,
    validate(sendMessageSchema),
    messageController.createMessage
  );

// Get all conversations for the authenticated user
router
  .route("/user")
  .get(authMiddleware.isAuthenticated, messageController.getUserConversations);

// Get unread messages count for the authenticated user
router
  .route("/user/unread")
  .get(authMiddleware.isAuthenticated, messageController.getUnreadMessages);

// Get messages between two users
router
  .route("/conversations/:userId2")
  .get(authMiddleware.isAuthenticated, messageController.getMessages);

// Mark message as read
router
  .route("/read/:messageId")
  .patch(authMiddleware.isAuthenticated, messageController.markAsRead);

// Delete message (soft and hard delete)
router
  .route("/delete/:messageId")
  .delete(messageController.hardDeleteMessage)
  .patch(messageController.softDeleteMessage);

// Get my messages from one user
router
  .route("/getFromOne/:senderId")
  .get(
    authMiddleware.isAuthenticated,
    messageController.getMyMessageFromOneUser
  );

export default router;
