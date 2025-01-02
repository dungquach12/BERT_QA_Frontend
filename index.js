require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const expressHbs = require("express-handlebars");
const session = require("express-session");

const environment = process.env.NODE_ENV || "development";

// Load the correct configuration based on the environment
const dbConfig = require("./config/config.json")[environment];

// Configure static web folders
app.use(express.static(__dirname + "/html"));

// Configure view templates
app.engine('hbs', expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layout",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        formatDate: (date) => {
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            });
        },
    }
}));

app.set("view engine", "hbs");

// Routes
// YOUR CODE HERE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session config
app.use(session({
    secret: process.env.SESSION_SECRET || "my secret",
    resave: false,
    saveUninitialized: false,
}))

app.use("/", require("./routes/authRouter"));
app.use("/conversation", require("./routes/conversationRouter"));

app.listen(port, () =>

    console.log(`Example app listening on port ${port} with env ${environment}`)
);