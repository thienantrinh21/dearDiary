const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("./config/keys").mongoURI;

const app = express();

//Connect to Mongoose
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected .."))
    .catch((err) => console.log(err));

//Load Idea Model
require("./models/Ideas");
const Idea = mongoose.model("ideas");

//Handlebars Middleware
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

//Process Form
app.post("/ideas", (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: "Please start your entry" });
    }
    if (errors.length > 0) {
        res.render("ideas/add", {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        };
        new Idea(newUser).save().then((idea) => {
            res.redirect("/ideas");
        });
    }
});

// //How middleware works
// app.use(function(req, res, next) {
//     // console.log(Date.now());
//     next();
//     //calls the next middleware that you will use in this case, it is app.get(.....)
// });

app.use(express.static(path.join(__dirname, "/public")));

//Index Route
app.get("/", (req, res) => {
    //(request,response)
    const title = "Welcome";
    res.render("index", { title });
    // .render activates functions
});
//.get gets information from the client

//About Route
app.get("/about", (req, res) => {
    res.render("ABOUT");
});

//Add Idea Form
app.get("ideas/add", (req, res) => {
    res.render("ideas/add");
});

// app.get("/projects", (req, res) => {
//     res.send("Hey this is where my projects goes");
// });

const port = 5000;

app.listen(port, () => {
    // .listen will listen for a certain port
    console.log(`Server started on port ${port}`);
    //es6 uses backtics and ${} for variables
});
