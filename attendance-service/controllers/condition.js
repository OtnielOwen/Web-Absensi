import Condition from "../models/conditionModel.js";

export const getCondition = async (req, res) => {
  try {
    const response = await Condition.findAll({});
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConditionById = async (req, res) => {
  try {
    const condition = await Condition.findOne({
      where: {
        uuid: req.params.slug,
      },
    });

    if (!condition)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.status(200).json({ data: condition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCondition = async (req, res) => {
  const { name } = req.body;
  try {
    await Condition.create({
      name: name,
    });
    res.status(201).json({ message: "Kondisi kesehatan berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCondition = async (req, res) => {
  const { name } = req.body;

  try {
    const condition = await Condition.findOne({
      where: {
        uuid: req.params.slug,
      },
    });

    if (!condition)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    await Condition.update(
      { name },
      {
        where: {
          id: condition.id,
        },
      }
    );

    res.status(201).json({ message: "Kondisi kesehatan berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCondition = async (req, res) => {
  try {
    const condition = await Condition.findOne({
      where: {
        uuid: req.params.slug,
      },
    });

    if (!condition) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }

    await Condition.destroy({
      where: {
        id: condition.id,
      },
    });

    res.status(200).json({
      message: "Kondisi kesehatan berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};