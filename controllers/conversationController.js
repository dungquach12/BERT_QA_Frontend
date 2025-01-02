const controller = {};
const axios = require("axios");
const { where, or } = require("sequelize");
const models = require('../models');

controller.newConvPage = async (req, res) => {
    try {
        const conversations = await models.Conversation.findAll({
            where: {user_id: req.session.user.user_id},
            attributes: ["conversation_id", "last_updated"],
            order: [["last_updated", "DESC"]],
        });

        res.render("newConversation", { conversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).send("An error occurred. Please try again later.");
    }
};

controller.createConversation = async (req, res) => {
    try {
        const { context } = req.body;
        const conversation = await models.Conversation.create({
            user_id: req.session.user.user_id,
            last_updated: new Date(),
        });

        await models.Message.create({
            conversation_id: conversation.conversation_id,
            message: context,
            sender: "user-message",
        });

        res.redirect(`/conversation/${conversation.conversation_id}`);
    } catch (error) {
        console.error("Error creating conversation:", error);
        res.status(500).send("An error occurred. Please try again later.");
    }
};

controller.getConversationPage = async (req, res) => {
    try {
        const conversationList = await models.Conversation.findAll({
            where: {user_id: req.session.user.user_id},
            attributes: ["conversation_id", "last_updated"],
            order: [["last_updated", "DESC"]],
        });

        const conversation = await models.Conversation.findOne({
            where: {
                conversation_id: req.params.conversation_id,
                user_id: req.session.user.user_id
            },
            include: {
                model: models.Message,
                order: [["createdAt", "ASC"]],
            }
        });

        // res.send(conversation);

        res.render("detailConversation", {
            conversationList,
            conversation
        });
    } catch (error) {
        console.error("getConversationPage error", error);  
        res.status(500).send("An error occurred. Please try again later.");
    }
};

controller.getAnswer = async (req, res) => {
    try {
        const { question } = req.body;

        const conversation = await models.Conversation.findByPk(req.params.conversation_id, {
            include: {
                model: models.Message,
                order: [["createdAt", "ASC"]],
            },
        });

        if (!conversation || !conversation.Messages) {
            return res.status(404).send("Conversation not found or no messages available.");
        }

        const userMessage = conversation.Messages.find(
            (message) => message.sender === "user-message"
        );

        if (!userMessage) {
            return res.status(400).send("No user-message found in the conversation.");
        }

        const context = userMessage.message;

        const response = await axios.post(
            "https://bert-qa-model.onrender.com/answer",
            { passage: context, question: question },
            { headers: { "Content-Type": "application/json" } }
        );

        await models.Message.create({
            conversation_id: req.params.conversation_id,
            message: response.data.answer,
            sender: "bot-message",
        });

        res.json(response.data);
    } catch (error) {
        console.error("getAnswer error:", error.message);
        res.status(500).send("An error occurred. Please try again later.");
    }
}; 

controller.removeConversation = async (req, res) => {
    try {
        const { conversation_id } = req.body;
        await models.Conversation.destroy({
            where: {
                conversation_id: conversation_id,
                user_id: req.session.user.user_id,
            },
        });

        res.status(200).send("Conversation removed successfully.");
    } catch (error) {
        console.error("error", error);
        res.status(500).send("An error occurred. Please try again later.");
    }
};

module.exports = controller;