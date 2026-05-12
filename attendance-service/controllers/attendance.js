import Attendance from "../models/attendanceModel.js";
import axios from "axios";
import ExcelJS from "exceljs";
import { Parser } from "json2csv";
import EmployeeStatus from "../models/employeeStatusModel.js";
import Squad from "../models/squadModel.js";
import User from "../models/userModel.js";
import dayjs from "dayjs";
import { Op } from "sequelize";
import Location from "../models/locationModel.js";
import WorkingStatus from "../models/workingStatusModel.js";
import Condition from "../models/conditionModel.js";

export const getAttendance = async (req, res) => {
  const filterOptions = {};

  // Convert page and limit to numbers using parseInt
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { userId } = req.query;

  if (req.query.start_date && req.query.end_date) {
    const startDate = new Date(req.query.start_date);
    const endDate = new Date(req.query.end_date);
    filterOptions.date = {
      [Op.between]: [startDate, endDate],
    };
  }

  const offset = (page - 1) * limit;
  console.log(userId);

  const options = {
    offset,
    limit,
    where: {
      ...filterOptions,
      userId: req.isAdmin ? userId : req.userId,
    },
    include: [
      { model: WorkingStatus, attributes: ["id", "uuid", "name"] },
      { model: Condition, attributes: ["id", "uuid", "name"] },
      {
        model: Location,
        attributes: ["id", "uuid", "name", "address", "latitude", "longitude"],
      },
    ],
  };

  try {
    const { count, rows } = await Attendance.findAndCountAll(options);
    const totalPages = Math.ceil(count / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
    const data = rows;

    res.status(200).json({
      success: true,
      data,
      pagination: {
        current_page: Number(page),
        total_pages: Number(totalPages),
        total_items: Number(count),
        per_page: Number(limit),
        next: nextPage,
        prev: prevPage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsersAttendance = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const filterOptions = {};
  const filterOptionsByUser = {};

  if (req.query.employee_status_id) {
    filterOptionsByUser.employeeStatusId = req.query.employee_status_id;
  }

  if (req.query.squad_id) {
    filterOptionsByUser.squadId = req.query.squad_id;
  }

  if (req.query.q) {
    filterOptionsByUser[Op.or] = [{ name: { [Op.iLike]: `%${req.query.q}%` } }];
  }

  if (req.query.start_date && req.query.end_date) {
    const startDate = new Date(req.query.start_date);
    const endDate = new Date(req.query.end_date);
    filterOptions.date = {
      [Op.between]: [startDate, endDate],
    };
  }

  const options = {
    offset,
    limit,
    where: filterOptions,
    include: [
      {
        model: User,
        attributes: [
          "id",
          "uuid",
          "name",
          "email",
          "isAdmin",
          "createdAt",
          "photoProfile",
        ],
        where: filterOptionsByUser,
        include: [
          {
            model: EmployeeStatus,
            attributes: ["id", "uuid", "name"],
          },
          {
            model: Squad,
            attributes: ["id", "uuid", "name"],
          },
        ],
      },
      { model: WorkingStatus, attributes: ["id", "uuid", "name"] },
      { model: Condition, attributes: ["id", "uuid", "name"] },
      {
        model: Location,
        attributes: ["id", "uuid", "name", "address", "latitude", "longitude"],
      },
    ],
  };

  try {
    const { count, rows } = await Attendance.findAndCountAll(options);

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

export const exportAttendanceToExcel = async (req, res) => {
  try {
    const { typeExport } = req.query;
    const filterOptions = {};
    const filterOptionsByUser = {};

    // Apply filters dynamically
    if (req.query.employee_status_id) {
      filterOptionsByUser.employeeStatusId = req.query.employee_status_id;
    }

    if (req.query.squad_id) {
      filterOptionsByUser.squadId = req.query.squad_id;
    }

    if (req.query.q) {
      filterOptionsByUser[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.q}%` } },
      ];
    }

    if (req.query.start_date && req.query.end_date) {
      const startDate = new Date(req.query.start_date);
      const endDate = new Date(req.query.end_date);
      filterOptions.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Fetch attendance data with all related models
    const attendances = await Attendance.findAll({
      where: filterOptions,
      include: [
        {
          model: User,
          attributes: ["id", "uuid", "name", "email"],
          where: filterOptionsByUser,
          include: [
            { model: EmployeeStatus, attributes: ["name"] },
            { model: Squad, attributes: ["name"] },
          ],
        },
        { model: WorkingStatus, attributes: ["name"] },
        { model: Condition, attributes: ["name"] },
        {
          model: Location,
          attributes: ["name", "address", "latitude", "longitude"],
        },
      ],
    });

    // Handle no data scenario
    if (attendances.length === 0) {
      return res.status(404).json({
        message: "No attendance data found for the given filters",
      });
    }

    // Export to Excel
    if (typeExport.includes("xlsx")) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Attendance");

      // Add header row
      worksheet.addRow([
        "UUID User",
        "Name",
        "Email",
        "Employee Status",
        "Squad",
        "Date",
        "Work Info",
        "Health Condition",
        "Location",
        "Address",
        "Latitude",
        "Longitude",
      ]);

      // Add data rows
      attendances.forEach((attendance) => {
        worksheet.addRow([
          attendance.user.uuid,
          attendance.user.name,
          attendance.user.email,
          attendance.user.employeeStatus?.name || "N/A",
          attendance.user.squad?.name || "N/A",
          attendance.date,
          attendance.workingStatus?.name || "N/A",
          attendance.condition?.name || "N/A",
          attendance.location?.name || "N/A",
          attendance.location?.address || "N/A",
          attendance.location?.latitude || "N/A",
          attendance.location?.longitude || "N/A",
        ]);
      });

      // Set Excel response headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=attendance.xlsx"
      );

      // Write and send Excel file
      await workbook.xlsx.write(res);
      res.end();
    }
    // Export to CSV
    else {
      const csvData = attendances.map((attendance) => ({
        "UUID User": attendance.user.uuid || "N/A",
        Name: attendance.user.name || "N/A",
        Email: attendance.user.email || "N/A",
        "Employee Status": attendance.user.employeeStatus?.name || "N/A",
        Squad: attendance.user.squad?.name || "N/A",
        Date: attendance.date,
        "Work Info": attendance.workingStatus?.name || "N/A",
        "Health Condition": attendance.condition?.name || "N/A",
        Location: attendance.location?.name || "N/A",
        Address: attendance.location?.address || "N/A",
        Latitude: attendance.location?.latitude || "N/A",
        Longitude: attendance.location?.longitude || "N/A",
      }));

      const csv = new Parser().parse(csvData);

      // Set CSV response headers
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=attendance.csv"
      );

      // Send CSV data
      res.send(csv);
    }
  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ message: "Error exporting data" });
  }
};
export const getAttendanceByPeriod = async (req, res) => {
  try {
    const { month, year } = req.query;
    let startDate, endDate;

    if (month && year) {
      const selectedMonth = month;
      const selectedYear = year;
      startDate = dayjs(
        `${selectedYear}-${selectedMonth}-01`,
        "YYYY-M-D"
      ).toDate();
      endDate = dayjs(`${selectedYear}-${selectedMonth}-01`, "YYYY-MM-DD")
        .endOf("month")
        .toDate();
    } else if (year) {
      const selectedYear = year;
      startDate = new Date(selectedYear, 0, 1); // Start of the selected year
      endDate = new Date(selectedYear, 11, 31); // End of the selected year
    } else {
      startDate = new Date(new Date().getFullYear(), 0, 1); // Start of the current year
      endDate = new Date(); // Today's date
    }

    const attendanceRecords = await Attendance.findAll({
      where: {
        userId: req.userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        { model: Condition, attributes: ["id", "uuid", "name"] },
        { model: WorkingStatus, attributes: ["id", "uuid", "name"] },
      ],
    });

    res.status(200).json({
      success: true,
      data: attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkedAttendance = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();

    if (currentDayOfWeek === 0 || currentDayOfWeek === 6) {
      return res.status(201).json({
        success: true,
        type: "weekend",
        status: 201,
        message: "Attendance can only be recorded on weekdays",
      });
    }

    const existingAttendance = await Attendance.findOne({
      where: {
        userId: req.userId,
        date: currentDate,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        type: "weekday",
        status: 201,
        message: "Attendance has already been recorded for today",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      type: "weekday",
      message: "Attendance has not been recorded for today",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

async function getLocationDetails(latitude, longitude) {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          format: "json",
          lat: latitude,
          lon: longitude,
        },
        headers: {
          "User-Agent": "attendance-app",
        },
      }
    );

    console.log("LOCATION RESPONSE:", response.data);

    const { display_name, address } = response.data;

    return {
      name:
        address?.road ||
        address?.neighbourhood ||
        address?.suburb ||
        address?.city ||
        "Unknown",
      address: display_name || "Unknown",
    };
  } catch (error) {
    console.error("Error fetching location details:", error.response?.data || error.message);

    return {
      name: "Unknown",
      address: "Unknown",
    };
  }
}

export const createAttendance = async (req, res) => {
  try {
    const { description, latitude, longitude, workingStatusId, conditionId } =
      req.body;

    const currentDate = new Date();
    const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res
        .status(400)
        .json({ message: "Attendance can only be recorded on weekdays" });
    }

    const existingAttendance = await Attendance.findOne({
      where: {
        userId: req.userId,
        date: currentDate,
      },
    });

    if (existingAttendance) {
      return res
        .status(400)
        .json({ message: "Attendance has already been recorded for today" });
    }

    let location = null;
    if (latitude && longitude) {
      const locationData = await getLocationDetails(latitude, longitude);
      location = await Location.create({
        latitude,
        longitude,
        name: locationData.name,
        address: locationData.address,
      });
    }

    const attendance = await Attendance.create({
      description,
      date: currentDate,
      time: currentTime,
      userId: req.userId,
      workingStatusId,
      conditionId,
      locationId: location ? location.id : null,
    });

    res
      .status(201)
      .json({ success: true, message: "Terimakasih sudah absen", attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
