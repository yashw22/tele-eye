
const db = require("../models");
const Bed = db.bed;
//const Device = db.device;

const fs = require("fs");

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err);
        }
        try {
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch (err) {
            return cb && cb(err);
        }
    });
}

exports.addBeds = (req, res) => {

    var name = req.body.bedName,
        devices = req.body.devices;
    console.log(name, devices);

    jsonReader("./data.json", (err, dataval) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }

        let ins = {};
        ins.name = name;
        ins.devices = devices;
        dataval.push(ins);

        fs.writeFile("", JSON.stringify(dataval), err => {
            if (err) console.log("Error writing file:", err);
            res.send("update success!");
        });
    });



    /*
    const hospital = new Hospital({
        hospName: req.body.hospName,
        hospLocation: req.body.hospLocation,
    });
    hospital.save((err, user) => {
        if (err) { res.status(500).send({ message: err }); return; }
        res.send("New hospital inserted:\n" + JSON.stringify(req.body));
    });
    */

};

exports.getBeds = (req, res) => {

    jsonReader("./data.json", (err, dataval) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        res.send(dataval);
    });


    /*
    Hospital.find({})
        .exec(function (err, hospital) {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log(hospital);
            res.status(200).send(hospital);
        });

    */
}