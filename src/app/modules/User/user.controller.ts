import { Request, RequestHandler, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../../utils/sendResponse";
import catchAsync from "../../../utils/catchAsync";
import pick from "../../../utils/pick";
import httpStatus from "http-status";
import { userFilterableFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

const createAdmin = catchAsync(async (req, res) => {
  const result = await userServices.createAdminIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});
const createDoctor = catchAsync(async (req, res) => {
  const result = await userServices.createDoctorIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});
const createPatient = catchAsync(async (req, res) => {
  const result = await userServices.createPatientIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllUser: RequestHandler = catchAsync(async (req, res) => {
  const filter = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await userServices.getAllUserFromDB(filter, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User data retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});
const changeProfileStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id, req.body);
  const result = await userServices.changeProfileStatusIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});
const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userServices.getMyProfileFromDB(user as IAuthUser);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your profile data retrieved successfully",
      data: result,
    });
  }
);
const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userServices.updateMyProfileIntoDB(
      user as IAuthUser,
      req
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your profile data retrieved successfully",
      data: result,
    });
  }
);
export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUser,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
