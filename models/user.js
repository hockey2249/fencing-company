var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
 	username: String,
 	password: String,
});

UserSchema.statics.newUser = function(username, password){
};

UserSchema.statics.hashPassword = function(password, cb){
	bcrypt.hash(password, null, null, cb);
};

UserSchema.methods.validatePassword = function(password, cb){
	bcrypt.compare(password, this.password, cb);
};

var User = mongoose.model('User', UserSchema);
module.exports = User;
