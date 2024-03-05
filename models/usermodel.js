const mongoose = require('mongoose');
const UserSchema = new  mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
        default:""
    },
    followers:{
        type:[String],
        default:[],
    },
    following:{
        type:[String],
        default:[],
    },
    bio:{
        type:String,
        default:""
    }


},{
    timestamps:true,

}

)

const User = mongoose.model('User' , UserSchema);
module.exports = User;