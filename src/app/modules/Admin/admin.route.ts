import { NextFunction, Request, Response, Router } from "express";
import { adminControllers } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { validationSchema } from "./admin.validation.schema";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.getAllAdmin
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.getAdminById
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(validationSchema.updateAdminSchema),
  adminControllers.updateAdmin
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.deleteAdmin
);

export const adminRoutes = router;
