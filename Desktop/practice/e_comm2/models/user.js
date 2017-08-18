var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;


var ratingSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    ratedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var User = new Schema({
    OauthId : String,
    OauthToken: String,

    username : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String
    },
    email:{
        type:String,
        unique: true
    } ,
    designation:{
        enums:[{designer:Boolean, default: false}, {regular:Boolean, default: false}],
        required: true
    },
    d_o_b: String,
    picture : String,
    bio: String,
    height: String,
    trouser_length: String,
    width: String,
    blah: String,
    hip: String,
    waist: String,
    chest: String,

    following:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    followers:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    rating:[ratingSchema],//for rating designers

    regular: {
        type: Boolean,
        default: false

    },
    designer: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: true
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);