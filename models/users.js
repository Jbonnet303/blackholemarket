const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    internalName: {type:String, required:true, unique:true},
    username: String,
    password: String,
    isAdmin: {type:Boolean, default: false}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
