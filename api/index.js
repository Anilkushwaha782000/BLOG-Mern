const express = require('express');
const app = express()
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

app.use(express.json())
dotenv.config()
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("mongodb is connected");
}).catch((err) => {
    console.log("could not connect to the  mongodb");
})
const User = require("./models/UserModel")
app.get("/test", (req, res) => {
    res.json("hello from server side");
})
app.post("/api/signup", async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email || username === "" || email === "" || password === "") {
        return res.status(400).json({ message: "All field are required", status: 400 });
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword, email });
            await newUser.save();
            return res.json({ message: "Sign up successful" });
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false });
        }
    }
});
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
        return res.status(400).json({ message: "All fields are required ", status: 400 });
    }
    else {
        try {
            const validUser = await User.findOne({ email });
            if (!validUser) {
                return res.status(404).json({ message: "User not found", status: 404,success:false })
            }
            const validPassword = bcrypt.compareSync(password, validUser.password)
            if (!validPassword) {
                return res.status(400).json({ message: "Invalid Password", status: 400,success:false })
            }
            const token = jwt.sign({ id: validUser._id },process.env.JWT_SECRET);
            const {password:pass,...rest}=validUser._doc
            if(token){
                return res.status(200).cookie("access_token", token, { httpOnly: true }).json({ message: "Signin successfull", success: true, rest })
            }
           

        } catch (error) {
            console.error("Error occurred:", error);
            return res.status(500).json({ message: "Internal Server Error", status: 500 });

        }
    }

})
app.post('/api/google',async (req,res)=>{
    const {name,email,image}=req.body;
    // console.log("req.body",req.body);
    try {
        const user=await User.findOne({email})
        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            const {password,...rest}=user._doc
           return res.status(200).cookie('access_token',token,{httpOnly:true}).json({message:"Logged in Successfully",status:200,rest})
        }
        else{
            const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
            const hashedPassword=bcrypt.hashSync(generatedPassword,10)
            const newUser=new User({username:name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
                email,
                profilePicture:image,password:hashedPassword})
            const saveUser=await newUser.save()
            const token=jwt.sign({id:saveUser._id},process.env.JWT_SECRET)
            const {password,...rest}=saveUser._doc
           return res.status(200).cookie('access_token',token,{httpOnly:true}).json({message:"Logged in Successfully",status:200,rest})
        }
    } catch (error) {
        console.log("error",error);
        return res.status(500).json({message:"Internal server error"})
    }
})
app.listen(3001, () => {
    console.log("server is running on port 3001!!")
})