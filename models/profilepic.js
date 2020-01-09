var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var users = require('./user');



var uploadSchema = new Schema({
    imagename: String,
});

module.exports = mongoose.model('profilepics', uploadSchema);