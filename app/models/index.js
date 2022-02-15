const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.hospital = require("./hospital.model");
db.bed = require("./bed.model");
//db.device = require("./device.model");
db.user = require("./user.model");

module.exports = db;