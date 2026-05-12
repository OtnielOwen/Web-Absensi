import dotenv from "dotenv";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import EmployeeStatus from "../models/employeeStatusModel.js";
import Squad from "../models/squadModel.js";
import { Op } from "sequelize";
import FacePhoto from "../models/facePhotoModel.js";
import Attendance from "../models/attendanceModel.js";

import fs from "fs";
import path from "path";

dotenv.config();

export const getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const filterOptions = {};
  const searchOptions = {};

  if (req.query.employee_status_id) {
    filterOptions.employeeStatusId = req.query.employee_status_id;
  }

  if (req.query.squad_id) {
    filterOptions.squadId = req.query.squad_id;
  }

  if (req.query.q) {
    searchOptions[Op.or] = [{ name: { [Op.iLike]: `%${req.query.q}%` } }];
  }

  const options = {
    offset,
    limit,
    attributes: ["id", "uuid", "name", "email", "isAdmin", "createdAt"],
    include: [
      {
        model: EmployeeStatus,
        attributes: ["id", "uuid", "name"],
        where: filterOptions.employeeStatusId
          ? { id: filterOptions.employeeStatusId }
          : undefined,
      },
      {
        model: Squad,
        attributes: ["id", "uuid", "name"],
        where: filterOptions.squadId
          ? { id: filterOptions.squadId }
          : undefined,
      },
    ],
    where: searchOptions,
  };

  try {
    const { count, rows } = await User.findAndCountAll(options);

    const totalPages = Math.ceil(count / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const data = rows;

    res.status(200).json({
      success: true,
      data,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_items: count,
        per_page: limit,
        next: nextPage,
        previous: prevPage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  const paramsSlug = req.params.slug;

  try {
    const user = await User.findOne({
      where: {
        uuid: paramsSlug,
      },
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const responseUser = await User.findOne({
      attributes: ["id", "uuid", "name", "email", "isAdmin", "photoProfile", "createdAt"],
      where: {
        id: user.id,
      },
      include: [
        {
          model: EmployeeStatus,
          attributes: ["id", "uuid", "name"],
          where: {
            id: user.employeeStatusId,
          },
        },
        {
          model: Squad,
          attributes: ["id", "uuid", "name"],
          where: {
            id: user.squadId,
          },
        },
      ],
    });

    res.status(200).json({
      data: responseUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "User tidak ditemukan" });

  const match = await argon2.verify(user.password, password);
  if (!match)
    return res
      .status(400)
      .json({ success: false, message: "Password yang dimasukan salah" });

  const token = jwt.sign({ id: user.uuid }, "passwordKey");

  const employeeStatus = await EmployeeStatus.findOne({
    where: {
      id: user.employeeStatusId,
    },
    attributes: ["name"],
  });

  const squad = await Squad.findOne({
    where: {
      id: user.squadId,
    },
    attributes: ["name"],
  });

  res.status(200).json({
    success: true,
    data: {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      status: employeeStatus.name,
      squad: squad.name,
      photoProfile: user.photoProfile,
    },
    token,
  });
};

export const createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      employeeStatusId,
      squadId,
      nik, // 🔥 TAMBAHAN
    } = req.body;

    console.log("REQ BODY:", req.body); // optional debug

    // ❌ validasi password
    if (password !== confirmPassword)
      return res.status(400).json({
        success: false,
        message: "Password dan Confirm Password tidak cocok",
      });

    // 🔐 hash password
    const hashPassword = await argon2.hash(password);

    // ✅ create user
    const user = await User.create({
      name: name,
      email: email,
      password: hashPassword,
      nik: nik, // 🔥 WAJIB (biar gak error lagi)
      employeeStatusId: parseInt(employeeStatusId),
      squadId: parseInt(squadId),
    });

    res.status(201).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
      },
      message: "Register Berhasil",
    });
  } catch (error) {
    console.log("ERROR CREATE USER:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res, next) => {
  const paramsSlug = req.params.slug;
  const { name, email, employeeStatusId, squadId } = req.body;

  try {
    const user = await User.findOne({
      where: {
        uuid: paramsSlug,
      },
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    await User.update(
      {
        name: name,
        email: email,
        employeeStatusId: parseInt(employeeStatusId),
        squadId: parseInt(squadId),
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.status(201).json({
      success: true,
      message: "Data user berhasil diperbarui",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    console.log("REQ USER ID:", req.userId);

    const user = await User.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    user.photoProfile = req.file.filename;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Foto profile berhasil diupload",
      data: user,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    console.log("DELETE USER PARAM:", req.params.slug);

    const user = await User.findOne({
      where: {
        uuid: req.params.slug,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // hapus foto profile local
    if (user.photoProfile) {
      const imagePath = path.join(
        process.cwd(),
        "uploads/profile",
        user.photoProfile
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // hapus semua face photo user
    const facePhotos = await FacePhoto.findAll({
      where: {
        userId: user.id,
      },
    });

    facePhotos.forEach((photo) => {
      try {
        if (photo.photoUrl?.url) {
          const filename = photo.photoUrl.url.split("/").pop();

          const facePath = path.join(
            process.cwd(),
            "uploads",
            filename
          );

          if (fs.existsSync(facePath)) {
            fs.unlinkSync(facePath);
          }
        }
      } catch (err) {
        console.log(err);
      }
    });

    await FacePhoto.destroy({
      where: {
        userId: user.id,
      },
    });

    // hapus attendance user
    await Attendance.destroy({
      where: {
        userId: user.id,
      },
    });

    // hapus user
    await User.destroy({
      where: {
        id: user.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.log("DELETE USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};