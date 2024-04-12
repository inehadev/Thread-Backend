const express= require('express');
const app = express();
const Post = require('../models/postmodel');
const protectRoute = require('../middlewware/protectRoute');
const User = require('../models/usermodel')
const PostRoutes= express.Router();
const cloudinary = require('cloudinary').v2;

PostRoutes.post('/CreatePost' , protectRoute , async(req,res)=>{

    console.log(req.user);
    
    try {
        const{postedBy,text}=req.body;
        let {img}=req.body;
        
        if(!postedBy || !text){
            return res.status(400).json({error:"postedBy and text fields are required"});
        }
        
        const user = await User.findById( postedBy);
    
        if(!user){
            return res.status(400).json({error:"user not found"});
        }
      
        if(user._id.toString()!== req.user._id.toString()){
            return res.status(400).json({error:"Unathorized to create post"});
        }
        
        const maxlength=500;
        if(text.length>maxlength){
            return res.status(400).json({error:"text must be less than ${maxlength} characters"});
        }

        if(img){
            const uploadresponse =  await cloudinary.uploader.upload(img);
            img-uploadresponse.secure_url
        }
      
       const newPost = new Post({ postedBy, text, img });
        await newPost.save();
        return res.status(200).json({message:"Post created successfully " , newPost});

    } catch (error) {
        res.status(500).json({error:error.message}) 
        console.log("Error in CreatePost:",error.message);
 
     }


})


/// api to get the post

PostRoutes.get('/:postid' , protectRoute,  async (req,res)=>{
   try {
    const post = await Post.findById(req.params.postid);
    if(!post){
        return res.status(400).json({error:"post not found"});
    }
    res.status(200).json(post);
   } catch (error) {
    res.status(400).json({error:error.message});
   }
})


//api to delete the post 

PostRoutes.delete('/:postid' , protectRoute, async(req,res)=>{
    try {
        const post = await Post.findById(req.params.postid);
        if(!post){
            return res.status(400).json({error:"Post not found"});
        }
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({error:"Unauthorized to delete the post"});
        }

        await Post.findByIdAndDelete(req.params.postid);
        return res.status(200).json({error:"Post deleted successfully"});

        
    } catch (error) {
        return res.status(400).json({error:error.message});
    }
})

/// api to likeUnlike the post

PostRoutes.post('/like/:id', protectRoute , async(req,res)=>{
  const {id:postid}=req.params;
  const userid= req.user._id;
  const post = await Post.findById(postid);
  if(!post){
    return res.status(400).json({error:'Post not found'});

  }
  const userlikedPost = post.likes.includes(userid);
  
  if(userlikedPost){
    await Post.updateOne({_id:postid},{$pull:{likes:userid}});
    res.status(200).json({error:"userliked the post successfully"});
  }else{
    post.likes.push(userid);
    await post.save();
    return res.status(200).json({error:"Post liked successfully"})
  }

;
})

/// api to reply to the post

PostRoutes.post('/reply/:id' , protectRoute , async(req,res)=>{
    try{
    const {text}=req.body;
    const {  userProfilePic, username } = req.user;
    const {id:postid}=req.params;
    const   userId=req.user._id;
    
    const post = await Post.findById(postid);
    if(!post){
        return res.status(404).json({error:"Post not found"});
    }
    if (!text) {
        return res.status(400).json({ error: "Text field cannot be empty" });
    }
    const reply = {   userId, text,  userProfilePic, username };
   post.replies.push(reply);
    await post.save();
    return res.status(200).json({error:"user reply to post" , post});
}catch(error){
    res.status(500).json({error:error.message});
}
})


///api to get feed post

PostRoutes.get('/getFeedPost' , protectRoute , async(req,res)=>{
    try {
       console.log(user._id)
        const userId=req.user._id;
        const user= await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const following=user.following;
        const feedPost=await Post.find({postedBy:{$in:following}}).sort({createdAt: -1});
        return res.status(200).json(feedPost);
    }catch (error) {
        return res.status(500).json({message:error.message})
        
    }

})


module.exports=PostRoutes;