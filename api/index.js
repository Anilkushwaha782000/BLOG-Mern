const express = require('express');
const app = express()
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
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
                return res.status(404).json({ message: "User not found", status: 404, success: false })
            }
            const validPassword = bcrypt.compareSync(password, validUser.password)
            if (!validPassword) {
                return res.status(400).json({ message: "Invalid Password", status: 400, success: false })
            }
            const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = validUser._doc
            if (token) {
                return res.status(200).cookie("access_token", token, { httpOnly: true }).json({ message: "Signin successfull", success: true, rest })
            }


        } catch (error) {
            console.error("Error occurred:", error);
            return res.status(500).json({ message: "Internal Server Error", status: 500 });

        }
    }

})
app.post('/api/google', async (req, res) => {
    const { name, email, image } = req.body;
    // console.log("req.body",req.body);
    try {
        const user = await User.findOne({ email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const { password, ...rest } = user._doc
            return res.status(200).cookie('access_token', token, { httpOnly: true }).json({ message: "Logged in Successfully", status: 200, rest })
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10)
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                profilePicture: image, password: hashedPassword
            })
            const saveUser = await newUser.save()
            const token = jwt.sign({ id: saveUser._id }, process.env.JWT_SECRET)
            const { password, ...rest } = saveUser._doc
            return res.status(200).cookie('access_token', token, { httpOnly: true }).json({ message: "Logged in Successfully", status: 200, rest })
        }
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal server error" })
    }
})
app.post('/api/update/:userId', async (req, res) => {
    const token = req.cookies.access_token;
    // console.log("token", token)
    if (!token) {
        return res.status(401).json('Unauthorized!');
    } else {
        try {
            jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
                if (error) {
                    return res.status(500).json("Internal server error!");
                }
                req.user = user;
                if (req.user.id != req.params.userId) {
                    return res.status(403).json({ message: 'User is not allowed to update the user data', success: false });
                }
                if (req.body.password) {
                    if (req.body.password.length < 6) {
                        return res.status(400).json({ message: 'Password does not meet length requirements. It must be at least 8 characters long.', success: false });
                    }
                    req.body.password = bcrypt.hashSync(req.body.password, 10);
                }
                if (req.body.username) {
                    if (req.body.username.length < 3 || req.body.username.length > 20) {
                        return res.status(400).json({ message: 'Username must be between 3 to 20 characters.', success: false });
                    }
                    if (req.body.username.includes(' ')) {
                        return res.status(400).json({ message: 'Username cannot contain any space.', success: false });
                    }
                    if (req.body.username !== req.body.username.toLowerCase()) {
                        return res.status(400).json({ message: 'Username must be in lowercase.', success: false });
                    }
                    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
                        return res.status(400).json({ message: "Username must contain only letters and numbers.", success: false });
                    }
                }
                try {
                    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
                        $set: {
                            username: req.body.username,
                            email: req.body.email,
                            password: req.body.password,
                            profilePicture: req.body.profilePicture
                        }
                    }, { new: true });
                    const { password, ...rest } = updatedUser._doc
                    return res.status(200).json({ message: 'User updated successfully', success: true, rest });
                } catch (error) {
                    return res.status(500).json({message:"Internal server error",success:false});
                }
            });
        } catch (error) {
            return res.status(500).json({message:"Internal server error!",success:false});
        }
    }
});
app.post('/api/delete/:userId',(req,res)=>{
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json('Unauthorized!');
    }
    else{
        try {
            jwt.verify(token,process.env.JWT_SECRET,async (err,user)=>{
                if(err){
                    return res.status(500).json({message:"Internal server error!",success:false});  
                }
                req.user = user;
                console.log("req.user",req.user.id)
                console.log("req.param",req.params.userId)
                if (req.user.id != req.params.userId) {
                    return res.status(403).json({ message: 'User is not allowed to delete  the account', success: false });
                }
                try {
                    await User.findByIdAndDelete(req.params.userId);
                    res.status(200).json({message:'User has been deleted successfully', success:true})
                } catch (error) {
                    return res.status(500).json({message:error.message,success:false});  
                }
            })
        } catch (error) {
            return res.status(500).json({message:error.message,success:false}); 
        }
    }
})

app.listen(3001, () => {
    console.log("server is running on port 3001!!")
})