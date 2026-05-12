import Squad from "../models/squadModel.js";

export const getSquad = async (req, res) => {
  try {
    const response = await Squad.findAll({});
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSquadById = async (req, res) => {
  try {
    const squad = await Squad.findOne({
      where: {
        uuid: req.params.slug,
      },
    });

    if (!squad)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.status(200).json({ data: squad });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSquad = async (req, res) => {
  const { name } = req.body;
  try {
    await Squad.create({
      name: name,
    });
    res
      .status(201)
      .json({ message: "Berhasil nama squad berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSquad = async (req, res) => {
  const { name } = req.body;

  try {
    const squad = await Squad.findOne({
      where: {
        uuid: req.params.slug,
      },
    });

    if (!squad)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    await Squad.update(
      { name },
      {
        where: {
          id: squad.id,
        },
      }
    );

    res.status(201).json({ message: "Squad berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
