const express = require('express');
const mongoose = require('mongoose');
const app = express();
const UserRouter= express.Router();
const User = require('../models/usermodel');
const bcrypt=require('bcrypt');
const protectRoute = require('../middlewware/protectRoute');
const Post = require('../models/postmodel');
const cloudinary = require('cloudinary').v2;



UserRouter.post('/follow/:id' , protectRoute , async (req, res) => {
    try {
        const { id } = req.params;
        console.log("this is id:" , id);
      
        const usertomodify = await User.findById(id);
        const currentUser = await User.findById(req.user);
        console.log({currentUser,usertomodify})

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
        return res.status(500).json({ "error": error.message });
    }
});







UserRouter.put('/update/:id' ,protectRoute,  async (req,res)=>{

    
   
 const {name , username , email , password ,  bio  } = req.body;
      
        let {profilepic }=req.body;
        console.log(profilepic)
                const userId = req.user._id.toString();
                console.log(userId);
                let reqUserId = req.params.id;
                reqUserId = reqUserId.startsWith(':') ? reqUserId.slice(1) : reqUserId;
                console.log(reqUserId);
                console.log("Request Payload:", req.body);
                
      try {

        let user = await User.findById(userId);
        if(!user) {
            return res.status(400).json("user not found");
        }
       

        if(reqUserId!==userId ){
            return res.status(400).json("you can't update profile of others");
        }

        if(password){
      
            const hashpassword= await bcrypt.hash(password, 10);
            user.password = hashpassword;
        }
        console.log("working");

        if(profilepic){
            console.log("Profile picture:", profilepic);
           
                console.log("yes there is profile photo to be uploaded")
           

            const uploadresponse =  await cloudinary.uploader.upload(profilepic);
            profilepic-uploadresponse.secure_url

           
            
         }
    
     console.log("okk till here")
        
        user.name= name || user.name;
        user.username=username || user.username;
        user.email= email|| user.email;
        user.bio=bio || user.bio;
        user.profilepic=profilepic || user.profilepic;
        await user.save();
        console.log(user);
        return res.status(200).json({message:"Profile updated successfully"})
       
        
    } catch (error) {
        console.log("Error in Update:", error.message);
        return res.status(500).json({ message: "error in update proile user" });
    }

})




 UserRouter.get('/profile/:query' , async (req,res)=>{
    
    const {query} = req.params;
    try {
        let user;
        if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
            console.log("fine")
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}
        if(!user) return res.status(400).json({message:"User not found"});

        res.status(200).json(user);
        
    } catch (error) {
        console.log("Error in follow:", error.message);
        res.status(500).json({message:"erro in user get profie"});
    }
 })


    UserRouter.get("/getfeedpost" , async (req , res)=>{
        const posts = await Post.find({});
        console.log(posts);
        res.json(posts)
    })


    
UserRouter.get('/feedpost', protectRoute, async (req, res) => {
    try {
       
		const userId = req.user;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});


module.exports=UserRouter;