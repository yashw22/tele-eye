const db = require("../models");
const Hospital = db.hospital;
const ICU = db.icu;
const Bed = db.bed;


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

exports.deleteHospital = (req, res) => {
    Bed.deleteMany({ hospID: req.body.hosp_ID }).exec(function (err) {
        if (err) { res.status(500).send({ message: err }); return; }

        ICU.deleteMany({ hospID: req.body.hosp_ID }).exec(function (err) {
            if (err) { res.status(500).send({ message: err }); return; }

            Hospital.deleteOne({ _id: req.body.hosp_ID }).exec(function (err) {
                if (err) { res.status(500).send({ message: err }); return; }
                console.log("Hospital deleted.");
                res.status(200).send("Hospital deleted");
            });
        });
    });
}