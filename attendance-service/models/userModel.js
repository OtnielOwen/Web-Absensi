import { Sequelize } from "sequelize";
import db from "../config/database.js";
import EmployeeStatus from "./employeeStatusModel.js";
import Squad from "./squadModel.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "user",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    employeeStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    squadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

EmployeeStatus.hasOne(User);
User.belongsTo(EmployeeStatus, {
  foreignKey: "employeeStatusId",
});

Squad.hasOne(User);
User.belongsTo(Squad, {
  foreignKey: "squadId",
});

export default User;
