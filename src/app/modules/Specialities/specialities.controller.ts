import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { specialitesServices } from "./specialities.service";
import { Request, Response } from "express";

const insertSpecialities = catchAsync(async (req, res) => {
  const result = await specialitesServices.insertSpecialitiesIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialities  created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialitesServices.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties data fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialitesServices.deleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialty deleted successfully",
    data: result,
  });
});

export const specialitiesControllers = {
  insertSpecialities,
  getAllFromDB,
  deleteFromDB,
};
