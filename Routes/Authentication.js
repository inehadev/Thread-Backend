const express= require('express');
const User = require('../models/usermodel');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie =require('cookie-parser')
const AuthRouter = express.Router();
 const generateTokenAndSetCookies =require('../utilis/helper/generateTokenAndSetCookies')


AuthRouter.post('/register' , async (req,res)=>{
    const { name , username , email , password } = req.body;
    const existingUser = await  User.findOne({username , email});
    if(existingUser){
       return res.status(400).json( {error:" email already register try with another email"})
    }else{
        const securePassword = await bcrypt.hash(password,10);

        let user = new User ({
            name,
            username,
            email,
            password:securePassword,
           
        })
        user = await  user.save();
        if (user) {
			

			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				username: user.username,
				bio: user.bio,
				profilePic:User.updateSearchIndex.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
        return  res.status(200).json(user);
       
           

        
    }
})


AuthRouter.post('/login' , async(req,res)=>{
    try{
    const {username , password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        res.status(404).json({ error:"User not Found"});
    }

    const ismatch =await  bcrypt.compare(password , user.password)
    if(!ismatch){
        res.status(400).json({ error:"password incorrect"});
    }
    
        const token = jwt.sign({ userId: user._id } , "x-jwt-token");
        
        
        if(token){
           
            res.status(200).json({
                token,
                _id:user._id,
                name:user.name,
                username:user.username,
                email:user.email,
                password:user.password,
                bio:user.bio,
                profilepic:user.profilepic

            })
            console.log("user is loggin successfull")
    
        }
    }catch(error){
        console.log("error in login");
    }
 
})


AuthRouter.post('/logout' , async(req,res)=>{
    try {
       res.cookie("jwt" ,"" ,{maxAge:1});
       res.status(200).json({message:"user logout sucessfully"});
    } catch (error) {
        res.status(500).json({message:err.message});
    }

   
})



module.exports = AuthRouter;
