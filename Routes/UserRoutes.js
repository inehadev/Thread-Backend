const express = require('express');
const app = express();
const UserRouter= express.Router();
const User = require('../models/usermodel');
const bcrypt=require('bcrypt');
const protectRoute = require('../middlewware/protectRoute')

UserRouter.post('/follow/:id', protectRoute, async (req, res) => {
    try {
        const { id } = req.params;
        const usertomodify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id) return res.status(400).json({ message: "You cannot follow and unfollow yourself" });

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



UserRouter.post('/update/:id' , protectRoute , async (req,res)=>{

    const {name , username , email , password , profilepic , bio} = req.body;
    const userId = req.user._id;
    try {

        let user = await User.findById(userId);
        if(!userId) {
            return res.status(400).json("user not found");
        }

        if(password){
            const hashpassword= await bcrypt.hash(password, 10);
            user.password = hashpassword;
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
        return res.status(500).json({ message: error.message });
    }

})

module.exports=UserRouter;