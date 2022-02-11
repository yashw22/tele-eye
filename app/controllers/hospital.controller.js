const db = require("../models");
const Hospital = db.hospital;

exports.addHospital = (req, res) => {
    const hospital = new Hospital({
        hospName: req.body.hospName,
        hospLocation: req.body.hospLocation,
    });
    hospital.save((err, user) => {
        if (err) { res.status(500).send({ message: err }); return; }
        res.send("New hospital inserted:\n" + JSON.stringify(req.body));
    });
};

exports.getHospitals = (req, res) => {
    Hospital.find({})
        .exec(function (err, hospital) {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log(hospital);
            res.status(200).send(hospital);
        });
}