const express = require('express');
const router = express.Router();
const controller = require('../controllers/conversationController');
const { checkAuth } = require("../utils/checkAuth");

router.get('/', checkAuth, controller.newConvPage);
router.get("/:conversation_id", checkAuth, controller.getConversationPage);

router.post("/", checkAuth, controller.createConversation);
router.post("/:conversation_id/answer", checkAuth, controller.getAnswer);

router.post("/remove", controller.removeConversation);

module.exports = router;