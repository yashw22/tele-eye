const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config();

const db = require("./app/models");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, "public")));

db.mongoose
    .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Successfully connect to MongoDB."); })
    .catch(err => {
        console.error("MongoDB connection error", err);
        process.exit();
    });


app.get("/beds", function (req, res) {
    res.sendFile(__dirname + "/public/beds.html");
});

require("./app/routes/hospital.routes")(app);
require("./app/routes/bed.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});