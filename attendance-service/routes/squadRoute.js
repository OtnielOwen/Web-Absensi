import express from "express";
import {
  getSquad,
  getSquadById,
  createSquad,
  updateSquad,
  deleteSquad,
} from "../controllers/squad.js";
import { adminOnly, verifyUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/api/v1/squad", getSquad);
router.get("/api/v1/squad/:slug", verifyUser, adminOnly, getSquadById);
router.post("/api/v1/squad/create", verifyUser, adminOnly, createSquad);
router.patch("/api/v1/squad/edit/:slug", verifyUser, adminOnly, updateSquad);
router.delete("/api/v1/squad/delete/:slug", verifyUser,adminOnly,deleteSquad);

export default router;