import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../modules/user/models/user.model";

export interface AuthRequest extends Request {
  user?: IUser;
}

export enum Role {
  Admin = "admin",
  Customer = "customer",
}

class AuthMiddleware {
  async isAuthenticated(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token = req.headers.authorization;
    if (!token || token == undefined) {
      res.status(403).json({
        message: "Please Login",
      });
      return;
    }
    // console.log("tokrmm", token);
    // verify token
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      async (err, decoded: any) => {
        if (err) {
          res.status(403).json({
            message: "Invalid Token",
          });
        } else {
          try {
            const userData = await User.findById(decoded.id);
            if (!userData) {
              res.status(404).json({
                message: "No user with that token",
              });
              return;
            }
            // console.log("userdataa", userData);
            req.user = userData;
            next();
          } catch (error) {
            res.status(500).json({
              message: "Something went wrong",
            });
          }
        }
      }
    );
  }

  restrictTo(...roles: Role[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      let userRole = req?.user?.role as Role;
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "You don't have permission",
        });
      } else {
        next();
      }
    };
  }
}

export default new AuthMiddleware();
