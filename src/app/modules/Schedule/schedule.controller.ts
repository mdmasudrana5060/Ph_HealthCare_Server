import { Request, Response } from "express";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";
import catchAsync from "../../../utils/catchAsync";
import { scheduleServices } from "./schedule.service";
import sendResponse from "../../../utils/sendResponse";
import pick from "../../../utils/pick";

const inserIntoDB = catchAsync(async (req, res) => {
  const result = await scheduleServices.inserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const user = req.user;
    const result = await scheduleServices.getAllFromDB(
      filters,
      options,
      user as IAuthUser
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Schedule fetched successfully!",
      data: result,
    });
  }
);

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await scheduleServices.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule retrieval successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await scheduleServices.deleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule deleted successfully",
    data: result,
  });
});

export const scheduleControllers = {
  inserIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
};
