import express from "express";
import {
  createAttendance,
  getAttendance,
  getAttendanceByPeriod,
  checkedAttendance,
  getAllUsersAttendance,
  exportAttendanceToExcel,
} from "../controllers/attendance.js";
import { verifyUser, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/api/v1/attendance", verifyUser, getAttendance);
router.get("/api/v1/attendance-period", verifyUser, getAttendanceByPeriod);

router.get("/api/v1/attendance-check", verifyUser, checkedAttendance);
router.post("/api/v1/attendance/create", verifyUser, createAttendance);

// admin
router.get(
  "/api/v1/all-users/attendance",
  verifyUser,
  adminOnly,
  getAllUsersAttendance
);

router.get("/api/v1/all-users/attendance-export", exportAttendanceToExcel);

export default router;
