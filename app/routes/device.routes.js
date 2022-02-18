const controller = require("../controllers/device.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    app.post("/devices/esp32/upload", controller.esp32Upload);
    app.post("/devices/pm/getimages", authJwt.verifyToken, controller.getPMImages);
}