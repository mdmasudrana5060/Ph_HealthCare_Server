import { Request, Response } from "express";
import httpStatus from "http-status";
import { doctorScheduleServices } from "./doctorSchedule.service";
import { IAuthUser } from "../../interfaces/common";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import pick from "../../../utils/pick";
import { scheduleFilterableFields } from "./doctorSchedule.constant";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await doctorScheduleServices.insertIntoDB(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor Schedule created successfully!",
      data: result,
    });
  }
);

const getMySchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const user = req.user;
    const result = await doctorScheduleServices.getMySchedule(
      filters,
      options,
      user as IAuthUser
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Schedule fetched successfully!",
      data: result,
    });
  }
);

const deleteFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await doctorScheduleServices.deleteFromDB(
      user as IAuthUser,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Schedule deleted successfully!",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await doctorScheduleServices.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Schedule retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const doctorScheduleControllers = {
  insertIntoDB,
  getMySchedule,
  deleteFromDB,
  getAllFromDB,
};
