import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { authServices } from "./auth.service";
import { Request, Response } from "express";

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login Successfull",
    data: {
      accessToken: result.accessToken,
      needsPasswordChange: result.needsPasswordChange,
    },
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login Successfull",
    data: result,
  });
});
const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await authServices.changePassword(req.user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
);
const forgetPassword = catchAsync(async (req, res) => {
  const result = await authServices.forgetPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reset link is genereated successfully",
    data: result,
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  await authServices.resetPassword(token, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset!",
    data: null,
  });
});

export const authControllers = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
