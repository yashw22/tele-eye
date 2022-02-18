const req = require("express/lib/request");
const controller = require("../controllers/device.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    app.post("/devices/pm/getimages", authJwt.verifyToken, controller.getPMImages);
    // app.post("/devices/esp32/1/upload", controller.esp32Upload);
    app.post("/devices/esp32/1/upload", (req, res, next) => { req.deviceNo = 1; next(); }, controller.esp32Upload);
    app.post("/devices/esp32/2/upload", (req, res, next) => { req.deviceNo = 2; next(); }, controller.esp32Upload);

}