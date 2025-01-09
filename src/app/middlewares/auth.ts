import { NextFunction, Request, Response, Router } from "express";
import catchAsync from "../../utils/catchAsync";
import { verifyToken } from "../../helpers/jwtHelpers";
import config from "../config";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return catchAsync(
    async (
      req: Request & { user?: any },
      res: Response,
      next: NextFunction
    ) => {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are unauthorized");
      }
      const verifyUser = verifyToken(token, config.jwt_access_secret as string);

      if (roles && !roles.includes(verifyUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "You are unauthorized");
      }
      req.user = verifyUser;
      next();
    }
  );
};
export default auth;
