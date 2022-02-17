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
    Hospital.find({})
        .exec(function (err, hospitals) {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log("Hospitals List sent.");
            res.status(200).send(hospitals);
        });
}