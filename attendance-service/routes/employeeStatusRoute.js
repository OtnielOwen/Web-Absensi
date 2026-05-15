import express from "express";
import {
  getEmployeeStatus,
  getEmployeeStatusById,
  createEmployeeStatus,
  updateEmployeeStatus,
  deleteEmployeeStatus,
} from "../controllers/employeeStatus.js";
import { adminOnly, verifyUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/api/v1/employee-status", getEmployeeStatus);
router.get(
  "/api/v1/employee-status/:slug",
  adminOnly,
  verifyUser,
  getEmployeeStatusById
);
router.post(
  "/api/v1/employee-status/create",
  adminOnly,
  verifyUser,
  createEmployeeStatus
);
router.patch(
  "/api/v1/employee-status/edit/:slug",
  adminOnly,
  verifyUser,
  updateEmployeeStatus
);
router.delete(
  "/api/v1/employee-status/delete/:slug",
  adminOnly,
  verifyUser,
  deleteEmployeeStatus
);

export default router;
