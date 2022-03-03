const db = require("../models");
const ICU = db.icu;
const Bed = db.bed;

exports.addICU = (req, res) => {
    const icu = new ICU({
        icuName: req.body.icuName,
        hospID: req.body.hospID,
        icuStatus: req.body.icuStatus,
    });
    icu.save((err, icu_res) => {
        if (err) { res.status(500).send({ message: err }); return; }
        console.log("New ICU inserted: " + req.body.icuName);
        res.status(200).send("New ICU inserted.");
    });
};

exports.getICUs = (req, res) => {
    // ICU.find({ hospID: req.query.hospID })
    ICU.aggregate([
        { $match: { hospID: db.mongoose.Types.ObjectId(req.query.hospID) } },
        {
            $lookup: {
                from: "beds", // collection name in db
                localField: "_id",
                foreignField: "icuID",
                as: "allBeds"
            }
        }
    ]).exec(function (err, icus) {
        if (err) { res.status(500).send({ message: err }); return; }
        console.log("ICU List sent.");
        res.status(200).send(icus);
    });
}

exports.deleteICU = (req, res) => {
    Bed.deleteMany({ icuID: req.body.icu_ID }).exec(function (err) {
        if (err) { res.status(500).send({ message: err }); return; }

        ICU.deleteOne({ _id: req.body.icu_ID }).exec(function (err) {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log("ICU deleted.");
            res.status(200).send("ICU deleted");
        });

    });
};