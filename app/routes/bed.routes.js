const controller = require("../controllers/bed.controller")
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    app.get("/bed/getbeds", controller.getBeds);
    app.post("/bed/addbed", controller.addBed);

    //app.get("/bed/getbeds", [authJwt.verifyToken], controller.getBeds);
    //app.post("/bed/addbed", [authJwt.verifyToken], controller.addBed);
}