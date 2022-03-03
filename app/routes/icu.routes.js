const controller = require("../controllers/icu.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.get("/icu/geticus", [authJwt.verifyToken], controller.getICUs);
    app.post("/icu/addicu", [authJwt.verifyToken], controller.addICU);
    app.delete("/icu/deleteicu", [authJwt.verifyToken], controller.deleteICU);
}