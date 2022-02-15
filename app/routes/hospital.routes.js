const controller = require("../controllers/hospital.controller")
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    app.get("/hospital/gethospitals", controller.getHospitals);
    app.post("/hospital/addhospital", controller.addHospital);

    //app.get("/hospital/gethospitals", [authJwt.verifyToken], controller.getHospitals);
    //app.post("/hospital/addhospital", [authJwt.verifyToken], controller.addHospital);
}