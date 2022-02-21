const mongoose = require("mongoose");

const Bed = mongoose.model(
    "Bed",
    new mongoose.Schema({
        bedName: String,
        icuID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ICU"
        },
        hospID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital"
        },
        bedStatus: {
            type: String,
            enum: ["active", "inactive"],
            //default: "inactive"
        },
        devices: [
            {
                deviceName: String,
                deviceID: String,
                deviceStatus: {
                    type: String,
                    enum: ["active", "inactive"],
                    //default: "inactive"
                }
            }
        ],
    },
        { timestamps: true }
    )
)

module.exports = Bed;