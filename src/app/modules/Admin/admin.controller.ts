import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../../utils/sendResponse";
import { adminServices } from "./admin.service";
import pick from "../../../utils/pick";
import { adminFilterableFields } from "./admin.constant";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";

const getAllAdmin: RequestHandler = catchAsync(async (req, res) => {
  const filter = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await adminServices.getAllAdminFromDB(filter, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAdminById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminServices.getAdminByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data By Id are retrieved successfully",
    data: result,
  });
});
const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminServices.updateAdminIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data updated successfully",
    data: result,
  });
});
const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminServices.deleteAdminIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data deleted successfully",
    data: result,
  });
});
export const adminControllers = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
