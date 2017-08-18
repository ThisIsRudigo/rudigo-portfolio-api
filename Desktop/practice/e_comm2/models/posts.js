var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var commentSchema = new Schema({
   comment: {
       type: String
   },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

var postSchema = new Schema({
    post: String,

    comments: [commentSchema],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

var posts = mongoose.model('post', postSchema);

module.exports = posts;