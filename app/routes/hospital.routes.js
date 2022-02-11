const controller = require("../controllers/hospital.controller")

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    app.post("/hospital/addhospital", controller.addHospital);
    app.get("/hospital/gethospitals", controller.getHospitals);
}