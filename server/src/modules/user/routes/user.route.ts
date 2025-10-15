import express, { Router } from "express";
import userController from "../controllers/user.controller";
import { validate } from "../../../middlewares/validate";
import { loginUserSchema, registerUserSchema } from "../utils/user.validation";

const router: Router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), userController.registerUser);
router
  .route("/login")
  .post(validate(loginUserSchema), userController.loginUser);
router.route("/").get(userController.getUser);
export default router;
