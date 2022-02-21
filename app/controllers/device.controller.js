const db = require("../models");
const PM = db.pm;

function addZero(number) {
    if (number <= 9) return "0" + number;
    else return number;
}

exports.esp32Upload = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let sampleFile, uploadPath, date = new Date();
    let formatatedDate = (addZero(date.getDate())) + "-" + (addZero(date.getMonth() + 1)) + "-" +
        date.getFullYear() + "_" + addZero(date.getHours()) + "-" +
        addZero(date.getMinutes()) + "-" + addZero(date.getSeconds());

    sampleFile = req.files.profile_pic;
    uploadPath = "\\esp32Uploads\\" + req.deviceNo + "__" + formatatedDate + ".jpg";


    sampleFile.mv(process.cwd() + "\\public" + uploadPath, (err) => {
        if (err) return res.status(500).send(err);
        const pm = new PM({
            deviceID: "esp32-" + req.deviceNo,
            directory: uploadPath,
            date: date,
        });
        pm.save((err, pm_res) => {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log("Image uploaded from esp32-" + req.deviceNo + ". Path: " + uploadPath);

            req.io.sockets.emit('broadcast', { deviceID: pm_res.deviceID });
            res.status(200).send("Image uploaded. Path: " + uploadPath);
        });
    });
};

exports.getPMImages = (req, res) => {
    var reqDate = new Date(req.body.date);
    PM.find({ deviceID: req.body.deviceID, date: { '$lte': reqDate } }, [], { sort: { "date": -1 }, limit: req.body.limit },
        // PM.find({}, [], { sort: { "date": -1 }, limit: req.body.limit, skip: req.body.skip },
        (err, pms) => {
            if (err) { res.status(500).send({ message: err }); return; }
            res.status(200).send(pms);
        });
};