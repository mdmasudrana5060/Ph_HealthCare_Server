import { Router } from "express";
import { prescriptionControllers } from "./prescription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/my-prescription",
  auth(UserRole.PATIENT),
  prescriptionControllers.patientPrescription
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  prescriptionControllers.createPrescription
);

export const prescriptionRoutes = router;
