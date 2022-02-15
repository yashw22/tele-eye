const db = require("../models");
const Bed = db.bed;
const Device = db.device;

const fs = require("fs");

exports.addBed = (req, res) => {
    const bed = new Bed({
        bedName: req.body.bedName,
        hospID: req.body.hospID,
        bedStatus: req.body.bedStatus,
        devices: req.body.devices,
    });
    bed.save((err, bed_res) => {
        if (err) { res.status(500).send({ message: err }); return; }
        console.log("New bed inserted: " + req.body.bedName);
        res.status(200).send("New bed inserted.");
    });


};

exports.getBeds = (req, res) => {
    //console.log("hospID: " + req.query.hospID);
    Bed.find({ hospID: req.query.hospID })
    //Bed.find()
        .exec(function (err, beds) {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log("Beds List sent.");
            res.status(200).send(beds);
        });
}