const db = require("../models");
const Bed = db.bed;
const Device = db.device;

const fs = require("fs");

exports.addBed = (req, res) => {
    const bed = new Bed({
        bedName: req.body.bedName,
        devices: req.body.devices,
        status: req.body.status
    });
    bed.save((err, bed_res) => {
        if (err) { res.status(500).send({ message: err }); return; }
        /*if(req.body.devices) {
            let deviceIDs = [];
            let device;
            for(var i=0; i<req.body.devices.length; i++){
                device = new Device({
                    deviceName: req.body.devices[i].deviceName,
                    deviceURL: req.body.devices[i].deviceURL,
                    status: req.body.devices[i].status,
                });
                device.save((err,device_res)=>{

                });
            }
        }*/
        res.status(200).send("New bed inserted:\n" + req.body);
    });


};

exports.getBeds = (req, res) => {
    Bed.find({ hospID: req.body.hospID })
        .exec(function (err, beds) {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log(beds);
            res.status(200).send(beds);
        });
}