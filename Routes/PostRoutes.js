const express= require('express');
const app = express();
const Post = require('../models/postmodel');
const protectRoute = require('../middlewware/protectRoute');
const User = require('../models/usermodel')
const PostRoutes= express.Router();
console.log("all ok")

PostRoutes.post('/CreatePost' , protectRoute , async(req,res)=>{
    
    try {
        const{postedBy , text , img}=req.body;
        
        if(!postedBy || !text){
            return res.status(400).json({message:"postedBy and text fields are required"});
        }
        
        const user = await User.findById(postedBy);
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        if(user._id.toString()!== req.user._id.toString()){
            return res.status(400).json({message:"Unathorized to create post"});
        }
        const maxlength=500;
        if(text.length>maxlength){
            return res.status(400).json({message:"text must be less than ${maxlength} characters"});
        }

        const newPost= new Post(postedBy , text , img);
        await newPost.save();
        return res.status(200).json({message:"Post created successfully " , newPost});

    } catch (error) {
        res.status(500).json({message:error.message}) 
        console.log("Error in CreatePoat:",error.message);
 
     }


})

module.exports=PostRoutes;