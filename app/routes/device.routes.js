// const req = require("express/lib/request");
const controller = require("../controllers/device.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app, io) {
    var nsp = io.of("/esp32");

    app.post("/devices/pm/getimages", authJwt.verifyToken, controller.getPMImages);
    app.post("/devices/esp32/upload", (req, res, next) => { req.io = nsp; next(); }, controller.esp32Upload);
}