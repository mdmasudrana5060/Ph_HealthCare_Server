import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { appointmentServices } from "./app/modules/Appointment/appointment.service";
import ApiError from "./app/errors/ApiError";
const app: Application = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

cron.schedule("* * * * *", () => {
  try {
    appointmentServices.cancelUnpaidAppointments();
  } catch (error) {
    console.log(error);
  }
});
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Api Not Found",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found",
    },
  });
});

export default app;
