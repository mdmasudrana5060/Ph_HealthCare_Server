import { doctorScheduleControllers } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";
import { Router } from "express";

const router = Router();

/**
 * API ENDPOINT: /doctor-schedule/
 *
 * Get all doctor schedule with filtering
 */
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  doctorScheduleControllers.getAllFromDB
);

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  doctorScheduleControllers.getMySchedule
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(DoctorScheduleValidation.create),
  doctorScheduleControllers.insertIntoDB
);

router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  doctorScheduleControllers.deleteFromDB
);

export const DoctorScheduleRoutes = router;
