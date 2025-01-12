import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { paymentServices } from "./payment.service";

const initPayment = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const result = await paymentServices.initPaymentIntoDB(appointmentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiate successfully",
    data: result,
  });
});
const validatePayment = catchAsync(async (req, res) => {
  const result = await paymentServices.initPaymentIntoDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment validate successfully",
    data: result,
  });
});

export const paymentControllers = {
  initPayment,
  validatePayment,
};
