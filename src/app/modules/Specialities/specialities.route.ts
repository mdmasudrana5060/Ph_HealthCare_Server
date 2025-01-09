import { NextFunction, Request, Response, Router } from "express";
import { specialitiesControllers } from "./specialities.controller";
import { fileUploader } from "../../../helpers/uploader";
import validateRequest from "../../middlewares/validateRequest";
import { specialitesValidation } from "./specialities.validation";

const router = Router();

router.post(
  "/",

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
  validateRequest(specialitesValidation.createSpecialities),
  specialitiesControllers.insertSpecialities
);

export const specialitiesRoutes = router;
