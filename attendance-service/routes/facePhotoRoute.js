import express from "express";
import multer from "multer";
import {
  createFacePhoto,
  deleteFacePhoto,
  getFacePhotoById,
  getFacePhotos,
  getFacePhotoMatcher,
} from "../controllers/facePhoto.js";
import { verifyUser } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage });

router.get("/api/v1/photos", verifyUser, getFacePhotos);
router.get("/api/v1/photos/match", verifyUser, getFacePhotoMatcher);
router.post(
  "/api/v1/photos/create",
  upload.single("photoUrl"),
  verifyUser,
  createFacePhoto
);
router.delete("/api/v1/photos/delete/:id", verifyUser, deleteFacePhoto);

export default router;
