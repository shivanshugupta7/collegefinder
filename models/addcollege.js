var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CollegeSchema = new Schema({
    cname: { type:String, lowercase:true},
    desig: {type:String},
    rname: { type:String},
    flag: { type:Number, default: 0 }
});


module.exports = mongoose.model("AddCollege",CollegeSchema);