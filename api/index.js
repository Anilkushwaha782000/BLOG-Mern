const express = require('express');
const app = express()
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const bcrypt=require('bcrypt')
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
app.post("/signup", async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email || username === "" || email === "" || password === "") {
        return res.status(400).json({ message: "All field are required",status:400 });
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password:hashedPassword, email });
            await newUser.save();
            return res.json({ message: "Sign up successful" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
});

app.listen(3001, () => {
    console.log("server is running on port 3001!!")
})