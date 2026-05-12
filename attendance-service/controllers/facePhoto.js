import FacePhoto from "../models/facePhotoModel.js";
import cloudinary from "cloudinary";
import User from "../models/userModel.js";
import { Op } from "sequelize";

export const getFacePhotos = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const options = {
    offset,
    limit,
    where: {
      userId: req.userId,
      // createdAt: {
      //   [Op.between]: [
      //     startDate ? new Date(startDate) : new Date(0),
      //     endDate ? new Date(endDate) : new Date(),
      //   ],
      // },
    },
  };

  try {
    const { count, rows } = await FacePhoto.findAndCountAll(options);

    const totalPages = Math.ceil(count / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
    const data = rows;

    // let response;
    // if (req.isAdmin) {
    //   response = await FacePhoto.findAll({
    //     attributes: ["uuid", "photoUrl", "faceDescriptor"],
    //     include: [
    //       {
    //         model: User,
    //         attributes: ["name", "email"],
    //       },
    //     ],
    //   });
    // } else {
    //   response = await FacePhoto.findAll({
    //     attributes: ["uuid", "photoUrl", "faceDescriptor"],
    //     where: {
    //       userId: req.userId,
    //     },
    //   });
    // }
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

export const getFacePhotoMatcher = async (req, res) => {
  try {
    const photos = await FacePhoto.findAll({
      where: {
        userId: req.userId,
      },
    });
    const user = await User.findOne({
      where: {
        id: req.userId,
      },
    });
    res.status(200).json({
      success: true,
      data: {
        user,
        photos,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFacePhotoById = async (req, res) => {
  try {
    const FacePhoto = await FacePhoto.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!FacePhoto)
      return res.status(404).json({ message: "Data tidak ditemukan" });
    let response;
    if (req.isAdmin) {
      response = await FacePhoto.findOne({
        attributes: ["uuid", "photoUrl", "faceDescriptor"],
        where: {
          id: FacePhoto.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await FacePhoto.findOne({
        attributes: ["uuid", "photoUrl", "faceDescriptor"],
        where: {
          [Op.and]: [{ id: FacePhoto.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFacePhoto = async (req, res) => {
  let faceGallery = {};
  const { faceDescriptor } = req.body;

  const result = await cloudinary.v2.uploader.upload(req.file.path);

  faceGallery = {
    url: result.secure_url,
    public_id: result.public_id,
  };

  try {
    await FacePhoto.create({
      photoUrl: faceGallery,
      faceDescriptor,
      userId: req.userId,
    });
    res
      .status(201)
      .json({ success: true, message: "Foto berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const updateFacePhoto = async (req, res) => {
//   try {
//     const FacePhoto = await FacePhoto.findOne({
//       where: {
//         uuid: req.params.id,
//       },
//     });
//     if (!FacePhoto)
//       return res.status(404).json({ message: "Data tidak ditemukan" });
//     const { name, price } = req.body;
//     if (req.role === "admin") {
//       await FacePhoto.update(
//         { name, price },
//         {
//           where: {
//             id: FacePhoto.id,
//           },
//         }
//       );
//     } else {
//       if (req.userId !== FacePhoto.userId)
//         return res.status(403).json({ message: "Akses terlarang" });
//       await FacePhoto.update(
//         { name, price },
//         {
//           where: {
//             [Op.and]: [{ id: FacePhoto.id }, { userId: req.userId }],
//           },
//         }
//       );
//     }
//     res.status(200).json({ message: "FacePhoto updated successfuly" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const deleteFacePhoto = async (req, res) => {
  try {
    const facePhoto = await FacePhoto.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    console.log(facePhoto);

    if (!facePhoto)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    if (req.userId !== facePhoto.userId)
      return res.status(403).json({ message: "Akses terlarang" });

    await FacePhoto.destroy({
      where: {
        [Op.and]: [{ id: facePhoto.id }, { userId: req.userId }],
      },
    });

    res.status(200).json({ success: true, message: "Foto berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
