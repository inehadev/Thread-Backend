const express= require('express');
const User = require('../models/usermodel');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthRouter = express.Router();

AuthRouter.post('/register' , async (req,res)=>{
    const { name , username , email , password , profilePic, followers , following  , bio} = req.body;
    const existingUser = await  User.findOne({username , email});
    if(existingUser){
        res.status(400).json("email already register try with another email")
    }else{
        const securePassword = await bcrypt.hash(password,10);

        let user = new User ({
            name,
            username,
            email,
            password:securePassword,
            profilePic,
            followers,
            following,
            bio

        })

        user = await  user.save();
        res.status(200).json(user);
    }
})


AuthRouter.post('/login' , async(req,res)=>{
    const {username , password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        res.status(404).json("User not Found");
    }

    const ismatch = bcrypt.compare(password , user.password);
    if(!ismatch){
        res.status(400).json("password incorrect");
    }
    else{
        const token = jwt.sign({ userId: user._id } , "secureKey");
        res.json({user , token});
    }

})


module.exports = AuthRouter;
