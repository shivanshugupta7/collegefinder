var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

/* The user schema and its attributes */

var UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    date: {
        type: Date,
        default: Date.now
    }
});

/* Hash the password before we even save it to the db */

UserSchema.pre('save', function (next) {
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




UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
















