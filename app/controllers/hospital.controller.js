const db = require("../models");
const Hospital = db.hospital;

exports.addHospital = (req, res) => {
    const hospital = new Hospital({
        hospName: req.body.hospName,
        hospLocation: req.body.hospLocation,
        status: req.body.status,
    });
    hospital.save((err, hospital_res) => {
        if (err) { res.status(500).send({ message: err }); return; }
        res.status(200).send("New hospital inserted:\n"+ hospital_res);
    });
};

exports.getHospitals = (req, res) => {
    Hospital.find({})
        .exec(function (err, hospitals) {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log(hospitals);
            res.status(200).send(hospitals);
        });
}