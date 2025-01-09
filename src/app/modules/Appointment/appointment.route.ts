import express, { Router } from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { AppointmentValidation } from "./appointment.validation";
import { appointmentControllers } from "./appointment.controller";

const router = Router();

/**
 * ENDPOINT: /appointment/
 *
 * Get all appointment with filtering
 * Only accessable for Admin & Super Admin
 */
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  appointmentControllers.getAllFromDB
);

router.get(
  "/my-appointment",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  appointmentControllers.getMyAppointment
);

router.post(
  "/",
  auth(UserRole.PATIENT),
  validateRequest(AppointmentValidation.createAppointment),
  appointmentControllers.createAppointment
);

router.patch(
  "/status/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  appointmentControllers.changeAppointmentStatus
);

export const appointmentRoutes = router;
