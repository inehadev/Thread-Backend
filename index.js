const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const AuthRouter = require('./Routes/Authentication');
const cookieParser = require('cookie-parser');
const UserRouter = require('./Routes/UserRoutes');
const PORT =5000;

mongoose.connect("mongodb+srv://neha-:210280481@cluster0.ljuzc3b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(
    console.log(`Database connected successfully`)
)
.catch((error)=>{
    console.log(error);
})
app.use(cookieParser());

app.use(express.json());
app.use(AuthRouter);
app.use(UserRouter)

app.listen(PORT,(req,res)=>{
    console.log(`server is running at ${PORT } `)
})