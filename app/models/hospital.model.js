const mongoose = require("mongoose");

const Hospital = mongoose.model(
    "Hospital",
    new mongoose.Schema({
        hospName: String,
        hospLocation: String,
        hospStatus: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive"
        }
    },
        { timestamps: true }
    )
);

module.exports = Hospital;