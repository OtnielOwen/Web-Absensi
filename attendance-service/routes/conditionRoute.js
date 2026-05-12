import express from "express";
import {
  getCondition,
  getConditionById,
  createCondition,
  updateCondition,
} from "../controllers/condition.js";
import { adminOnly, verifyUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/api/v1/condition", getCondition);
router.get("/api/v1/condition/:slug", verifyUser, adminOnly, getConditionById);
router.post("/api/v1/condition/create", verifyUser, adminOnly, createCondition);
router.patch(
  "/api/v1/condition/edit/:slug",
  verifyUser,
  adminOnly,
  updateCondition
);

export default router;
