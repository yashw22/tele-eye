const mongoose = require("mongoose");

const Bed = mongoose.model(
    "Bed",
    new mongoose.Schema(
        {
            bedName: String,
            hospID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hospital"
            },
            devices: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Device"
                }
            ],
            status: { type: String, enum: ["active", "inactive"] }
        },
        { timestamps: true }
    )
)

module.exports = Bed;