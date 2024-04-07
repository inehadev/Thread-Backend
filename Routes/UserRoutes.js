const express = require('express');
const mongoose = require('mongoose');
const app = express();
const UserRouter= express.Router();
const User = require('../models/usermodel');
const bcrypt=require('bcrypt');
const protectRoute = require('../middlewware/protectRoute')
const cloudinary = require('cloudinary').v2;

/// api to follow and unfollow user

UserRouter.post('/follow/:id', protectRoute, async (req, res) => {
    try {
        const { id } = req.params;
        const usertomodify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) return res.status(400).json({ message: "You cannot follow and unfollow yourself" });

        if (!usertomodify || !currentUser) return res.status(400).json({ message: "User not found" });

        const isfollowing = currentUser.following.includes(id);

        if (isfollowing) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await currentUser.save();
            return res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            return res.status(200).json({ message: "You are now following " + usertomodify.username });
        }
    } catch (error) {
        console.log("Error in follow:", error.message);
        return res.status(500).json({ message: error.message });
    }
});


//// api to update the user profile





UserRouter.put('/update/:id' ,protectRoute,  async (req,res)=>{

   
    try {

        const {name , username , email , password ,  bio  } = req.body;
        let {profilepic }=req.body;
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            // return res.status(400).send('Invalid user ID');
            console.log("Invalid user id");
          }
       
          console.log("this is user id" , userId);
        let user = await User.findById(userId);
        if(!userId) {
            return res.status(400).json("user not found");
        }

        if(req.params.id!==userId.toString()){
            return res.status(400).json("you can't update profile of others");
        }

        if(password){
            const hashpassword= await bcrypt.hash(password, 10);s
            user.password = hashpassword;
        }
        

        if(profilepic){
            if(user.profilepic){
                await cloudinary.uploader.destroy(user.profilepic.split("/").pop().split(".")[0])
            }
            const uploadresponse =  await cloudinary.uploader.upload(profilepic);
            profilepic=uploadresponse.secure_url
        }
        user.name= name || user.name;
        user.username=username || user.username;
        user.email= email|| user.email;
        user.bio=bio || user.bio;
        user.profilepic=profilepic || user.profilepic;

        await user.save();
        return res.status(200).json({message:"Profile updated successfully"})
        
    } catch (error) {
        console.log("Error in follow:", error.message);
        return res.status(500).json({ message: "error in update proile user" });
    }

})



/// api to get the user profile

 UserRouter.get('/profile/:username' , async (req,res)=>{
    
    const {username} = req.params;
    try {
        const user= await User.findOne({username}).select({ password: 0, updatedAt: 0 });
        if(!user) return res.status(400).json({message:"User not found"});

        res.status(200).json(user);
        
    } catch (error) {
        console.log("Error in follow:", error.message);
        res.status(500).json({message:"erro in user get profie"});
    }
 })

module.exports=UserRouter;