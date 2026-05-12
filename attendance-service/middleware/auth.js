import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res
        .status(401)
        .json({ message: "Silahkan login terlebih dahulu!" });

    const verified = jwt.verify(token, "passwordKey");
    if (!verified)
      return res
        .status(401)
        .json({ message: "Silahkan login terlebih dahulu!" });

    const user = await User.findOne({
      where: {
        uuid: verified.id,
      },
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    req.userId = user.id;
    req.isAdmin = user.isAdmin;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminOnly = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.json(false);

  const verified = jwt.verify(token, "passwordKey");
  if (!verified) return res.json(false);
  console.log(req);
  const user = await User.findOne({
    where: {
      uuid: verified.id,
    },
  });
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
  if (!user.isAdmin)
    return res.status(403).json({ message: "Akses terlarang" });
  next();
};
