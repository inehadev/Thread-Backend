const mongoose = require('mongoose');
const postSchema=mongoose.Schema({
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    text:{
        type:String,
        maxLength:500
    },
    img:{
        type:String
    },
    likes: [{
        // type: mongoose.Schema.Types.ObjectId, // Change type to ObjectId
        // ref: "user" // Reference the user model
        type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
    }],
    replies:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true
        },
        text:{
            type:String,
            required:true
        },
        userProfilePic:{
            type:String
        },
        username:{
            type:String
        }

    }]

},{
    timestamps:true
}
)

const Post = mongoose.model('Post' ,  postSchema );
module.exports = Post;
