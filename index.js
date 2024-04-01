const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const AuthRouter = require('./Routes/Authentication');
const cookieParser = require('cookie-parser');
const UserRouter = require('./Routes/UserRoutes');
const PostRoutes = require('./Routes/PostRoutes');
const cors = require('cors')
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

const PORT=process.env.PORT || 5000;

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			// To avoid warnings in the console
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
}


cloudinary.config({
   cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
   api_key:process.env.CLOUDINARY_API_KEY,
   api_secret:process.env.CLOUDINARY_API_SECRET


})
app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(AuthRouter);
app.use(UserRouter);
app.use(PostRoutes);

app.listen(PORT,(req,res)=>{
    console.log(`server is running at ${PORT } `)
})