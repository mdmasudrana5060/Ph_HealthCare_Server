import axios from "axios";
import prisma from "../../../Shared/prisma";
import { sslServices } from "../SSL/ssl.service";
import config from "../../config";
import { PaymentStatus } from "@prisma/client";
const initPaymentIntoDB = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });
  const initPaymentData = {
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    address: paymentData.appointment.patient.address,
    contactNumber: paymentData.appointment.patient.contactNumber,
  };

  const result = await sslServices.initPayment(initPaymentData);
  return {
    paymentUrl: result.GatewayPageURL,
  };
};
const validatePayment = async (payload: any) => {
  if (!payload || !payload.stratus || !(payload.status == "VALID")) {
    return {
      message: "Invalid Payment",
    };
  }
  const response = await sslServices.validatePayment(payload);
  if (response.status != "VALID") {
    return {
      message: "Invalid Payment",
    };
  }

  await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id, // Use a colon (:) and a comma (,) instead of a semicolon (;)
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: response,
      },
    });
    await tx.appointment.update({
      where: {
        id: updatedPaymentData.id,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });
  return {
    message: "payment success",
  };
};
export const paymentServices = {
  initPaymentIntoDB,
  validatePayment,
};
