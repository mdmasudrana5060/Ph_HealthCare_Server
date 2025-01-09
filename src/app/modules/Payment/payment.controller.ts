import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { paymentServices } from "./payment.service";

const initPayment = catchAsync(async (req, res) => {
  const result = await paymentServices.initPaymentIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiate successfully",
    data: result,
  });
});

export const paymentControllers = {
  initPayment,
};
