const mongoose = require("mongoose");

const Hospital = mongoose.model(
    "hospitals",
    new mongoose.Schema(
        {
            hospName: String,
            hospLocation: String,
        }
    )
)

module.exports = Hospital;