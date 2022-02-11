const mongoose = require("mongoose");

const Device = mongoose.model(
    "Device",
    new mongoose.Schema(
        {
            deviceName: String,
            deviceURL: String,
            status: { type: String, enum: ["active", "inactive"] }
        },
        { timestamps: true }
    )
)

module.exports = Device;