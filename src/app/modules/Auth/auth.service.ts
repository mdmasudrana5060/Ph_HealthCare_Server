import prisma from "../../../Shared/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import { UserStatus } from "@prisma/client";
import { createToken, verifyToken } from "../../../helpers/jwtHelpers";
import { sendEmail } from "../../../utils/sendEmail";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  let checkingPassword;
  if (user) {
    checkingPassword = await bcrypt.compare(payload.password, user.password);
  }

  if (!checkingPassword) {
    throw new Error("Password does not match");
  }
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_token_expires_in as string
  );
  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
    refreshToken,
  };
};
const refreshToken = async (token: string) => {
  if (!token) {
    throw new Error("You are unauthorized");
  }
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { email } = decoded;
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });
  const jwtPayload = {
    email: isUserExist?.email,
    role: isUserExist?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string
  );

  return {
    accessToken,
    needsPasswordChange: isUserExist.needsPasswordChange,
  };
};
const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const checkingPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!checkingPassword) {
    throw new Error("Password does not match");
  }
  const hashedPassword = await bcrypt.hash(payload.password, 12);
  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return true;
};
const forgetPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const jwtPayload = {
    email: userData?.email,
    role: userData?.role,
  };
  const resetPasswordToken = createToken(
    jwtPayload,
    config.jwt_reset_pass_token as string,
    config.jwt_reset_pass_token_expires_in as string
  );
  const resetUILink = `${config.reset_password_ui_link}?id=${userData.id}&token=${resetPasswordToken}`;
  sendEmail(
    userData.email,
    `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetUILink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
  );
};
const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = verifyToken(
    token,
    config.jwt_reset_pass_token as string
  );

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const password = await bcrypt.hash(payload.password, 12);

  // update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
};

export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
