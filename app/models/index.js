const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.hospital = require("./hospital.model");
db.bed = require("./bed.model");
db.user = require("./user.model");
db.pm = require("./pm.model");

module.exports = db;