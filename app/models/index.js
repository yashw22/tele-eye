const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.user = require("./user.model");
db.hospital = require("./hospital.model");
db.icu = require("./icu.model");
db.bed = require("./bed.model");
db.pm = require("./pm.model");

module.exports = db;