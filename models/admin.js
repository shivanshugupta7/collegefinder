var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

/* The user schema and its attributes */

var AdminSchema = new Schema({
    username:{ type: String, unique: true, lowercase: true },
    email: { type: String, unique: true, lowercase: true },
    password: { type: String },
    stud: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    clg: [{ type: Schema.Types.ObjectId, ref: 'AddCollege' }],
    rev: [{ type: Schema.Types.ObjectId, ref: 'collegereviews' }]
    
});

AdminSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});



AdminSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Admin', AdminSchema);