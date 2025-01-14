import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { metaServices } from "./meta.service";
import { IAuthUser } from "../../interfaces/common";

const fetchDashboardData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req?.user;
    const result = await metaServices.fetchDashboardDataFromDB(
      user as IAuthUser
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Meta data retrieved successfully",

      data: result,
    });
  }
);

export const metaControllers = { fetchDashboardData };
