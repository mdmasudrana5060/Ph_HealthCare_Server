import { Router } from "express";
import { paymentControllers } from "./payment.controller";

const router = Router();
router.post("/:appointmentId", paymentControllers.initPayment);

export const paymentRoutes = router;
