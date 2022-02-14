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
                    deviceName: String,
                    deviceURL: String,
                    status: { type: String, enum: ["active", "inactive"] }
                }
                /*
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Device"
                }
                */
            ],
            status: { type: String, enum: ["active", "inactive"] }
        },
        { timestamps: true }
    )
)

module.exports = Bed;