import { Router } from "express";
import { userRoutes } from "../modules/User/user.route";
import { adminRoutes } from "../modules/Admin/admin.route";
import { authRoutes } from "../modules/Auth/auth.route";
import { specialitiesRoutes } from "../modules/Specialities/specialities.route";
import { doctorRoutes } from "../modules/Doctor/doctor.route";
import { doctorScheduleRoutes } from "../modules/DoctorSchedule/doctorSchedule.route";
import { scheduleRoutes } from "../modules/Schedule/schedule.route";
import { appointmentRoutes } from "../modules/Appointment/appointment.route";
import { patientRoutes } from "../modules/Patient/patient.route";
import { paymentRoutes } from "../modules/Payment/payment.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/specialities",
    route: specialitiesRoutes,
  },
  {
    path: "/doctor",
    route: doctorRoutes,
  },
  {
    path: "/doctorSchedule",
    route: doctorScheduleRoutes,
  },
  {
    path: "/schedule",
    route: scheduleRoutes,
  },
  {
    path: "/appointment",
    route: appointmentRoutes,
  },
  {
    path: "/patient",
    route: patientRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
