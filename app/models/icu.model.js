const mongoose = require("mongoose");

const ICU = mongoose.model(
    "ICU",
    new mongoose.Schema({
        icuName: String,
        hospID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital"
        },
        icuStatus: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive"
        }
    },
        { timestamps: true }
    )
);

module.exports = ICU;