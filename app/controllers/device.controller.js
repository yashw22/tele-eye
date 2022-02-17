const { ESP32_UPLOAD_DIR } = require("../config");
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
    uploadPath = ESP32_UPLOAD_DIR + formatatedDate + ".jpg";

    sampleFile.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err);
        const pm = new PM({
            directory: uploadPath,
            date: date,
        });
        pm.save((err, pm_res) => {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log("Image uploaded. Path: " + uploadPath);
            res.status(200).send("Image uploaded. Path: " + uploadPath);
        });
    });
};