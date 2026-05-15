import EmployeeStatus from "../models/employeeStatusModel.js";

export const getEmployeeStatus = async (req, res) => {
  try {
    const response = await EmployeeStatus.findAll({});
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeStatusById = async (req, res) => {
  try {
    const employeeStatus = await EmployeeStatus.findOne({
      where: {
        uuid: req.params.slug,
      },
    });

    if (!employeeStatus)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.status(200).json({ data: employeeStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEmployeeStatus = async (req, res) => {
  const { name } = req.body;
  try {
    await EmployeeStatus.create({
      name: name,
    });
    res.status(201).json({ message: "Berhasil menambahkan status karyawan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployeeStatus = async (req, res) => {
  const { name } = req.body;

  try {
    const employeeStatus = await EmployeeStatus.findOne({
      where: {
        uuid: req.params.slug,
      },
    });

    if (!employeeStatus)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    await EmployeeStatus.update(
      { name },
      {
        where: {
          id: employeeStatus.id,
        },
      }
    );

    res.status(201).json({ message: "Berhasil diperbarui status karyawan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEmployeeStatus = async (req, res) => {
  try {
    const employeeStatus = await EmployeeStatus.findOne({
      where: {
        uuid: req.params.slug,
      },
    });

    if (!employeeStatus) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }

    await EmployeeStatus.destroy({
      where: {
        id: employeeStatus.id,
      },
    });

    res.status(200).json({
      message: "Berhasil menghapus status karyawan",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};