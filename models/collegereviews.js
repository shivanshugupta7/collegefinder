var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;
var collegereviews = new Schema({
    username: { type: String, require, lowercase:true },
    collegename: { type: String, require, lowercase: true },
    rtitle: { type: String, require },
    content: { type: String, require },
    year: {type: Number,require},
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
    branch: {type: String, require},
    flag:{ type: Number , default:0 },
    qualities:{
        placements: { type: Number, require },
        infrastructure: { type: Number, require },
        faculty: { type: Number, require },
        campuslife: { type: Number, require }
    },
    rating: { type: Number, require },
    createdAt: {
        type: Date,
        default: new Date(),
    }

});



module.exports = mongoose.model("collegereviews",collegereviews);
