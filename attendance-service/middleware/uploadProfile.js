import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, `profile-${Date.now()}${ext}`);
  },
});

const uploadProfile = multer({
  storage,
});

export default uploadProfile;