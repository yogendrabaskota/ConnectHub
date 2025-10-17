import express, { Router } from "express";
import messageController from "../controllers/message.controller";
import { validate } from "../../../middlewares/validate";
import { sendMessageSchema } from "../utils/message.validation";
import authMiddleware from "../../../middlewares/auth.middleware";

const router: Router = express.Router();

router
  .route("/send")
  .post(
    authMiddleware.isAuthenticated,
    validate(sendMessageSchema),
    messageController.createMessage
  );

router
  .route("/conversations/:userId2")
  .get(authMiddleware.isAuthenticated, messageController.getMessages);
router.route("/read/:messageId").patch(messageController.markAsRead);
router
  .route("/delete/:messageId")
  .delete(messageController.hardDeleteMessage)
  .patch(messageController.softDeleteMessage);

router
  .route("/getFromOne/:senderId")
  .get(
    authMiddleware.isAuthenticated,
    messageController.getMyMessageFromOneUser
  );

export default router;
