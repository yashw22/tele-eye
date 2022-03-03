const controller = require("../controllers/bed.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.get("/bed/getbeds", [authJwt.verifyToken], controller.getBeds);
    app.post("/bed/addbed", [authJwt.verifyToken], controller.addBed);
    app.delete("/bed/deletebed", [authJwt.verifyToken], controller.deleteBed);
    app.delete("/bed/deletedevice", [authJwt.verifyToken], controller.deleteDevice);
};