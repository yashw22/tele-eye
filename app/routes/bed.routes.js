const controller = require("../controllers/bed.controller")

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    app.get("/getdata", controller.getBeds);
    app.post("/putdata", controller.addBed);
}