import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { reviewControllers } from "./review.controller";

const router = Router();

router.post("/", auth(UserRole.PATIENT), reviewControllers.createReview);
export const reviewRoutes = router;
