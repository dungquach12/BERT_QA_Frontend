const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { body } = require("express-validator")

router.get('/', (req, res) => {
    if (req.session.user)
        res.redirect("/conversation")
    else 
        res.redirect("/login")
});
// router.get('/profile', controller.showLogin);

router.get('/login', controller.showLogin);
router.get('/register', controller.showRegister);
router.get('/reset-password', controller.showResetPassword);

router.post("/register",
    body("username").notEmpty().withMessage("Username is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    controller.handleError,
    controller.register
);

router.post("/login", controller.login);

router.post("/reset-password",
    body("email").notEmpty().withMessage("Email is required"),
    body("newPassword")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    body("confirmPassword")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    controller.handleError,
    controller.resetPassword
);

router.get("/logout", controller.logout);

module.exports = router;