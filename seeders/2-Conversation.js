"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    let conversations = [
      {
        conversation_id: "8b334823-28f7-4edd-9aec-959a803d09eb",
        user_id: "92a234c7-fb37-43d7-a4d1-050e52039f1b",
        last_updated: Sequelize.literal("NOW()"),
      },
      {
        conversation_id: "ae4abc0b-423e-4a91-81c4-9373ed8ad5f8",
        user_id: "92a234c7-fb37-43d7-a4d1-050e52039f1b",
        last_updated: Sequelize.literal("NOW()"),
      },
    ];

    conversations.forEach((conversation) => {
      conversation.createdAt = Sequelize.literal("NOW()");
      conversation.updatedAt = Sequelize.literal("NOW()");
    });

    await queryInterface.bulkInsert("Conversations", conversations, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Conversations", null, {});
  },
};
