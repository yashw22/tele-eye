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
    uploadPath = "\\esp32Uploads\\" + formatatedDate + ".jpg";

    sampleFile.mv(process.cwd() + "\\public" + uploadPath, (err) => {
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

exports.getPMImages = (req, res) => {
    PM.find({}, ["directory"], { sort: { "date": -1 }, limit: 1, skip: req.body.idx },
        (err, pms) => {
            if (err) { res.status(500).send({ message: err }); return; }
            res.status(200).send(pms[0].directory);

            /*
            //console.log(pms[0].directory);
            //res.sendFile(pms[0].directory);

            let formData = new FormData();
            formData.append('field', 'my value');
            formData.append('file', fs.createReadStream(pms[0].directory));
            //console.log(fs.createReadStream("Testing"));
            //console.log(fs.createReadStream(pms[0].directory));

            formData.append("img1", fs.createReadStream(pms[0].directory));
            res.setHeader('x-Content-Type', 'multipart/form-data; boundary=' + formData._boundary);
            res.setHeader('Content-Type', 'image/jpeg');
            formData.pipe(res);
            */
        });
};