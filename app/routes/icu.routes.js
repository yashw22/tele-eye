const controller = require("../controllers/icu.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    // app.use(function (req, res, next) {
    //     res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    //     next();
    // });

    app.get("/icu/geticus", [authJwt.verifyToken], controller.getICUs);
    app.post("/icu/addicu", [authJwt.verifyToken], controller.addICU);
}