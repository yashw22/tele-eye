const jwt = require("jsonwebtoken");
const db = require("../models");
require("dotenv").config();
const Role = db.role;

verifyToken = (req, res, next) => {
    let token = req.session.token;
    if (!token) {
        //return res.status(403).send({ message: "No token provided!" });
        res.redirect("/login");
        return;
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).send({ message: "Unauthorized!" });
        req.userId = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken
};

module.exports = authJwt;