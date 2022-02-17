const express = require('express');
const cors = require("cors");
const cookieSession = require("cookie-session");
const path = require('path');
require("dotenv").config();
const db = require("./app/models");
const { authJwt } = require("./app/middlewares");
const fileUpload = require('express-fileupload');

const app = express();
app.use(express.static(path.resolve(__dirname, "public")));
app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
        name: "session",
        secret: "COOKIE_SECRET",
        httpOnly: true
    })
);
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/', debug: false }));


db.mongoose
    .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Successfully connect to MongoDB."); })
    .catch(err => {
        console.error("MongoDB connection error", err);
        process.exit();
    });

app.get("/", function (req, res) {
    res.redirect("/hospitals");
});
app.get("/hospitals", authJwt.verifyToken, function (req, res) {
    res.sendFile(__dirname + "/public/hospitals.html");
});
app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/public/login.html");
});

require('./app/routes/auth.routes')(app);
require("./app/routes/hospital.routes")(app);
require("./app/routes/bed.routes")(app);
require("./app/routes/device.routes")(app);

/*
app.all("*", (req, res) => {
    //res.redirect("/hospitals");
    res.json({ message: "404 - PAGE NOT FOUND" });
});
*/

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});