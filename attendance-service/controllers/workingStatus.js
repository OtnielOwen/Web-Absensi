import WorkingStatus from "../models/workingStatusModel.js";

export const getWorkingStatus = async (req, res) => {
  try {
    const response = await WorkingStatus.findAll({});
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkingStatusById = async (req, res) => {
  try {
    const workingStatus = await WorkingStatus.findOne({
      where: {
        uuid: req.params.slug,
      },
    });

    if (!workingStatus)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.status(200).json({ data: workingStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWorkingStatus = async (req, res) => {
  const { name } = req.body;
  try {
    await WorkingStatus.create({
      name: name,
    });
    res.status(201).json({ message: "Status kerja berhasil menambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWorkingStatus = async (req, res) => {
  const { name } = req.body;

  try {
    const workingStatus = await WorkingStatus.findOne({
      where: {
        uuid: req.params.slug,
      },
    });

    if (!workingStatus)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    await WorkingStatus.update(
      { name },
      {
        where: {
          id: workingStatus.id,
        },
      }
    );

    res.status(201).json({ message: "Status kerja berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
