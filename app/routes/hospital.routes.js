const controller = require("../controllers/hospital.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.get("/hospital/gethospitals", [authJwt.verifyToken], controller.getHospitals);
    app.post("/hospital/addhospital", [authJwt.verifyToken], controller.addHospital);
    app.delete("/hospital/deletehospital", [authJwt.verifyToken], controller.deleteHospital);
}