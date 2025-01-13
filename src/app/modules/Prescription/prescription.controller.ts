import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { prescriptionServices } from "./prescription.service";
import { Request, Response } from "express";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../utils/pick";

const createPrescription = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await prescriptionServices.createPrescriptionIntoDB(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescription created successfully",
      data: result,
    });
  }
);
const patientPrescription = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await prescriptionServices.getMyPrescriptionFromDB(
      user as IAuthUser,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescription retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);
export const prescriptionControllers = {
  createPrescription,
  patientPrescription,
};
