const db = require("../models");
const Bed = db.bed;

exports.addBed = (req, res) => {
    const bed = new Bed({
        bedName: req.body.bedName,
        icuID: req.body.icuID,
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
    Bed.find({ icuID: req.query.icuID })
        .exec(function (err, beds) {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log("Beds List sent.");
            res.status(200).send(beds);
        });
}

exports.deleteBed = (req, res) => {
    Bed.deleteOne({ _id: req.body.bed_ID }).exec(function (err) {
        if (err) { res.status(500).send({ message: err }); return; }
        console.log("Bed deleted.");
        res.status(200).send("Bed deleted");
    });
};

exports.deleteDevice = (req, res) => {
    Bed.updateOne({ _id: req.body.bed_ID },
        { $pull: { devices: { _id: req.body.device_ID } } },
        function (err, docs) {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log("Device deleted.");
            res.status(200).send("Device deleted");
        });
};