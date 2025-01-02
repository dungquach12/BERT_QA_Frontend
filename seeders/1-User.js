"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    let users = [
      {
        user_id: "92a234c7-fb37-43d7-a4d1-050e52039f1b",
        username: "john_doe",
        email: "john@example.com",
        password_hash: await bcrypt.hash("password123", 10),
      },
      {
        user_id: "e7fc2cc9-95d6-47b0-9d78-aad54dffacf9",
        username: "jane_smith",
        email: "jane@example.com",
        password_hash: await bcrypt.hash("password123", 10),
      },
      {
        user_id: "4818ef51-9199-414b-83ea-e22cd8551619",
        username: "mike_jones",
        email: "mike@example.com",
        password_hash: await bcrypt.hash("password123", 10),
      },
      {
        user_id: "6bed75ab-dd16-4342-aa14-8a4bce94879c",
        username: "susan_lee",
        email: "susan@example.com",
        password_hash: await bcrypt.hash("password123", 10),
      },
      {
        user_id: "5c8f9e29-a92e-4cdb-bd82-2ab387bb2306",
        username: "peter_wilson",
        email: "peter@example.com",
        password_hash: await bcrypt.hash("password123", 10),
      },
    ];

    users.forEach((user) => {
      user.createdAt = Sequelize.literal("NOW()");
      user.updatedAt = Sequelize.literal("NOW()");
    });

    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
