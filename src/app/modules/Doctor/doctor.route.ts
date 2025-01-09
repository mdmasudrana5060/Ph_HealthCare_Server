import { Router } from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorValidation } from "./doctor.validation";
import { doctorControllers } from "./doctor.controller";

const router = Router();

// task 3
router.get("/", doctorControllers.getAllFromDB);

//task 4
router.get("/:id", doctorControllers.getByIdFromDB);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  validateRequest(DoctorValidation.update),
  doctorControllers.updateIntoDB
);

//task 5
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorControllers.deleteFromDB
);

// task 6
router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorControllers.softDelete
);

export const doctorRoutes = router;
