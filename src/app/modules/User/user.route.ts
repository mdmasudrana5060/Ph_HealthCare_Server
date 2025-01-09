import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

import { fileUploader } from "../../../helpers/uploader";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userControllers.getAllUser
);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  userControllers.getMyProfile
);

router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch (err) {
      next(new Error("Invalid JSON in request body"));
    }
  },

  validateRequest(userValidation.createAdmin),
  userControllers.createAdmin
);
router.post(
  "/create-doctor",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }

      next();
    } catch (err) {
      next(new Error("Invalid JSON in request body"));
    }
  },

  validateRequest(userValidation.createDoctor),
  userControllers.createDoctor
);
router.post(
  "/create-patient",

  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }

      next();
    } catch (err) {
      next(new Error("Invalid JSON in request body"));
    }
  },

  validateRequest(userValidation.createPatient),
  userControllers.createPatient
);
router.patch(
  "/update-profile",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),

  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }

      next();
    } catch (err) {
      next(new Error("Invalid JSON in request body"));
    }
  },

  userControllers.updateMyProfile
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(userValidation.updateStatus),
  userControllers.changeProfileStatus
);
export const userRoutes = router;
