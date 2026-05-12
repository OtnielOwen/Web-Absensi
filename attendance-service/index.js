import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cloudinary from "cloudinary";

dotenv.config(); // WAJIB PALING ATAS

import db from "./config/database.js";
import EmployeeStatusRoute from "./routes/employeeStatusRoute.js";
import SquadRoute from "./routes/squadRoute.js";
import UserRoute from "./routes/userRoute.js";
import FaceRoute from "./routes/facePhotoRoute.js";
import AttendanceRoute from "./routes/attendanceRoute.js";
import WorkingStatusRoute from "./routes/workingStatusRoute.js";
import ConditionRoute from "./routes/conditionRoute.js";

const app = express();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  await db.sync();
})();

app.use(cors({
  credentials: true,
  origin: "*",
}));

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use(AttendanceRoute);
app.use(FaceRoute);
app.use(EmployeeStatusRoute);
app.use(WorkingStatusRoute);
app.use(ConditionRoute);
app.use(SquadRoute);
app.use(UserRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(`server running at port ${process.env.APP_PORT}`);
});