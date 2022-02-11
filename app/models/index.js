const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.hospital = require("./hospital.model");
db.bed = require("./bed.model");
db.device = require("./device.model");

module.exports = db;