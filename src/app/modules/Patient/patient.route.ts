import { Router } from "express";
import { patientControllers } from "./patient.controller";

const router = Router();

router.get("/", patientControllers.getAllFromDB);

router.get("/:id", patientControllers.getByIdFromDB);

router.patch("/:id", patientControllers.updateIntoDB);

router.delete("/:id", patientControllers.deleteFromDB);
router.delete("/soft/:id", patientControllers.softDelete);

export const patientRoutes = router;
