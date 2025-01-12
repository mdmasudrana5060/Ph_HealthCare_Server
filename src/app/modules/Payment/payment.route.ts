import { Router } from "express";
import { paymentControllers } from "./payment.controller";

const router = Router();
router.post("/:appointmentId", paymentControllers.initPayment);
router.get("/ipn", paymentControllers.validatePayment);
export const paymentRoutes = router;
