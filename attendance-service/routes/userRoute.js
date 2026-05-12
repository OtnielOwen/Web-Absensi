import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  uploadProfilePhoto
} from "../controllers/user.js";
import { adminOnly, verifyUser } from "../middleware/auth.js";
import uploadProfile from "../middleware/uploadProfile.js";

const router = express.Router();

router.get("/api/v1/user", verifyUser, adminOnly, getUsers);
router.get("/api/v1/user/:slug", verifyUser, getUserById);
router.post("/api/v1/user/create", createUser);
router.patch("/api/v1/user/edit/:slug", verifyUser, adminOnly, updateUser);
router.post("/api/v1/user/signin", loginUser);

router.put(
  "/api/v1/user/profile-photo",
  verifyUser,
  uploadProfile.single("photo"),
  uploadProfilePhoto
);

export default router;
