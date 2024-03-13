const express= require('express');
const User = require('../models/usermodel');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie =require('cookie-parser')
const AuthRouter = express.Router();
 const generateTokenAndSetCookies =require('../utilis/helper/generateTokenAndSetCookies')
 const protectRoute = require('../middlewware/protectRoute')

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
        if(user){
            generateTokenAndSetCookies(user._id,res);
       }
        
        res.json({user , token});
       
        
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


AuthRouter.post('/follow/:id' , protectRoute , async(req,res)=>{
try {
   const {id}=req.params;
   const usertomodify = await User.findById(id);
   const currentUser = await User.findById(req.user._id);
   
   if(id===req.user._id)return res.status(400).json({message:"You can not follow and unfollow YourSelf"});

   if(!usertomodify|| !currentUser)  return res.status(400).json({message:"User not found"})
   const isfollowing=currentUser.following.includes(id);
    await currentUser.save();
    return res.status(200).json({ message: "You are now following " + usertomodify.username });
    if(isfollowing){
        await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
        await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
        // res.status(200).json({message:"user unfollowed successfully"})
        return res.status(200).json({ message: "You are now following " + usertomodify.username });
    
    }else{
        await User.findByIdAndUpdate(id,{ $push:{followers: req.user._id}});
        await User.findByIdAndUpdate(req.user._id , {$push:{following:id}});
    
    }
        
    
} catch (error) {
    res.status(500).json({message:error.message});
    console.log("Error in follow:" , error.message);
    
}
})





module.exports = AuthRouter;
