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
                    deviceStatus: {
                        type: String,
                        enum: ["active", "inactive"],
                        //default: "inactive"
                    }
                }
                /*
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Device"
                }
                */
            ],
            bedStatus: {
                type: String,
                enum: ["active", "inactive"],
                //default: "inactive"
            }
        },
        //{ timestamps: true }
    )
)

module.exports = Bed;