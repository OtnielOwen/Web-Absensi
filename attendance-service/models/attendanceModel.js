import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./userModel.js";
import WorkingStatus from "./workingStatusModel.js";
import Condition from "./conditionModel.js";
import Location from "./locationModel.js";

const { DataTypes } = Sequelize;

const Attendance = db.define(
  "attendance",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    workingStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    conditionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

User.hasMany(Attendance);
Attendance.belongsTo(User, { foreignKey: "userId" });

WorkingStatus.hasMany(Attendance);
Attendance.belongsTo(WorkingStatus, { foreignKey: "workingStatusId" });

Condition.hasMany(Attendance);
Attendance.belongsTo(Condition, { foreignKey: "conditionId" });

Location.hasMany(Attendance);
Attendance.belongsTo(Location, { foreignKey: "locationId" });

export default Attendance;
