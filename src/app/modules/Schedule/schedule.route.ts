import { Router } from "express";
import { scheduleControllers } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", auth(UserRole.DOCTOR), scheduleControllers.getAllFromDB);

/**
 * API ENDPOINT: /schedule/:id
 *
 * Get schedule data by id
 */
router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  scheduleControllers.getByIdFromDB
);

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  scheduleControllers.inserIntoDB
);

/**
 * API ENDPOINT: /schdeule/:id
 *
 * Delete schedule data by id
 */
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  scheduleControllers.deleteFromDB
);

export const scheduleRoutes = router;
