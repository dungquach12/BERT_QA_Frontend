const controller = {};
const models = require("../models");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

controller.showIndex = (req, res) => {
    res.render("index");
}

controller.showLogin = (req, res) => {
    res.render("auth-login", { layout: "auth", title: "Login" });
}

controller.showRegister = (req, res) => {
    res.render("auth-register", { layout: "auth", title: "Register" });
}

controller.showResetPassword = (req, res) => {
    res.render("auth-password-reset", { layout: "auth", title: "Password reset" });
}

controller.register = async (req, res) => {
    if (res.locals.message) {
        return res.render("auth-register", {
            layout: "auth",
            title: "Register"
        });
    }

    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await models.User.create({
            username,
            email,
            password_hash: hashedPassword,
        });
        res.render("auth-login", {
            layout: "auth",
            message: "User created"
        });
    } catch (error) {
        console.error(error);
        res.render("auth-register", {
            layout: "auth",
            message: "Something went wrong. Please try again"
        });
    }
}

controller.login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
        const user = await models.User.findOne({
            where: {
                [Op.or]: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail }
                ]
            }
        })

        if (!user) {
            return res.render("auth-login", {
                layout: "auth",
                title: "Login",
                message: "Invalid username, email or password"
            });
        }

        if (bcrypt.compareSync(password, user.password_hash) == false) {
            return res.render("auth-login", {
                layout: "auth",
                title: "Login",
                message: "Invalid username, email or password"
            });
        }
        req.session.user = {
            user_id: user.user_id,
            username: user.username,
        }

        res.redirect('/');
    } catch (error) {
        console.log("Error:", error);
        res.render("auth-login", {
            layout: "auth",
            title: "Login",
            message: "Something went wrong"
        });
    }
}

controller.resetPassword = async (req, res) => {
    if (res.locals.message) {
        return res.render("auth-password-reset", {
            layout: "auth",
            title: "Password reset"
        });
    }
    const { email, newPassword, confirmPassword } = req.body;
    try {
        const existEmail = await models.User.findOne({ where: { email: email } });
        if (!existEmail) {
            return res.render("auth-password-reset", {
                layout: "auth",
                title: "Password reset",
                message: "Invalid email or password"
            });
        }
        if (newPassword !== confirmPassword) {
            return res.render("auth-password-reset", {
                layout: "auth",
                title: "Password reset",
                message: "Invalid email or password"
            });
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await models.User.update(
            { password_hash: newHashedPassword },
            {
                where: { user_id: existEmail.user_id },
            }
        );
        res.render("auth-login", {
            layout: "auth",
            message: "Password changed"
        });
    } catch (error) {
        console.log("Error:", error);
        res.render("auth-password-reset", {
            layout: "auth",
            title: "Password reset",
            message: "Something went wrong"
        });
    }
}

controller.handleError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let message = "";
        errors.mapped(error => message += error.msg + "<br>");
        res.locals.message = message;
    }
    next();
};

controller.logout = (req, res) => {
    req.session.destroy();
    res.render("auth-login", {
        layout: "auth",
        message: "Loged out"
    });
}

module.exports = controller;