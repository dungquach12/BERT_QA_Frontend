"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Conversation, { foreignKey: "user_id" });
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false, // Ensure username is required
        unique: true,     // Ensure uniqueness of username
        validate: {
          notEmpty: true, // Prevent empty strings
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure email is unique
        validate: {
          isEmail: true, // Validate email format
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false, // Password is required
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,  // Enables createdAt and updatedAt
      underscored: false, // Use snake_case for column names (created_at, updated_at)
    }
  );
  return User;
};
