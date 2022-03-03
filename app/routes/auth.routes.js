const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
    app.post("/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail], controller.signup);
    app.post("/auth/signin", controller.signin);
    app.post("/auth/signout", controller.signout);

};