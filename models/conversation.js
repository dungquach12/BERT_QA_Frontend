"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.belongsTo(models.User, { foreignKey: "user_id" });
      Conversation.hasMany(models.Message, { foreignKey: "conversation_id" });
    }
  }

  Conversation.init(
    {
      conversation_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Conversation",
      timestamps: true,
      underscored: false,
    }
  );

  return Conversation;
};
