const db = require("../models");
const Hospital = db.hospital;


exports.addHospital = (req, res) => {
    const hospital = new Hospital({
        hospName: req.body.hospName,
        hospLocation: req.body.hospLocation,
        hospStatus: req.body.hospStatus,
    });
    hospital.save((err, hospital_res) => {
        if (err) { res.status(500).send({ message: err }); return; }
        console.log("New hospital inserted: " + req.body.hospName);
        res.status(200).send("New hospital inserted.");
    });
};

exports.getHospitals = (req, res) => {
    Hospital.aggregate([
        {
            $lookup: {
                from: "icus", // collection name in db
                localField: "_id",
                foreignField: "hospID",
                as: "allICUs"
            }
        },
        {
            $lookup: {
                from: "beds", // collection name in db
                localField: "_id",
                foreignField: "hospID",
                as: "allBeds"
            }
        }
    ])
        .exec(function (err, hospitals) {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log("Hospitals List sent.");
            //console.log(hospitals);
            res.status(200).send(hospitals);
        });
}