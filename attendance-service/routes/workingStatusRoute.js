import express from "express";
import {
  getWorkingStatus,
  getWorkingStatusById,
  createWorkingStatus,
  updateWorkingStatus,
  deleteWorkingStatus,
} from "../controllers/workingStatus.js";
import { adminOnly, verifyUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/api/v1/working-status", getWorkingStatus);
router.get(
  "/api/v1/working-status/:slug",
  adminOnly,
  verifyUser,
  getWorkingStatusById
);
router.post(
  "/api/v1/working-status/create",
  adminOnly,
  verifyUser,
  createWorkingStatus
);
router.patch(
  "/api/v1/working-status/edit/:slug",
  adminOnly,
  verifyUser,
  updateWorkingStatus
);
router.delete(
  "/api/v1/working-status/delete/:slug",
  adminOnly,
  verifyUser,
  deleteWorkingStatus
);

export default router;
