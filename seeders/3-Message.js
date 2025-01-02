"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    let messages = [
      {
        message_id: "69fb54ee-957e-478c-9550-c236ce535689",
        conversation_id: "8b334823-28f7-4edd-9aec-959a803d09eb",
        sender: "user",
        message: "Hello!",
      },
      {
        message_id: "aedbe24a-3f28-4f5c-ac95-a7f75a995d84",
        conversation_id: "ae4abc0b-423e-4a91-81c4-9373ed8ad5f8",
        sender: "bot",
        message: "Hi there!",
      },
    ];

    messages.forEach((message) => {
      message.createdAt = Sequelize.literal("NOW()");
      message.updatedAt = Sequelize.literal("NOW()");
    });

    await queryInterface.bulkInsert("Messages", messages, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Messages", null, {});
  },
};
