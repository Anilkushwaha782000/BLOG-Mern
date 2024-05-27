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
const Post = require('./models/PostModal')
const Comment=require('./models/CommentModal')
const path=require('path')
const __dirname=path.resolve()
app.use(express.static(path.join(__dirname,'/client/dist')))
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'))
})
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
            const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
            const { password: userPassword, ...rest } = validUser._doc
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
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET)
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
            const token = jwt.sign({ id: saveUser._id, isAdmin: saveUser.isAdmin }, process.env.JWT_SECRET)
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
                    return res.status(500).json({ message: error.message, success: false });
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
                    return res.status(500).json({ message: error.message, success: false });
                }
            });
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false });
        }
    }
});
app.post('/api/delete/:userId', (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json('Unauthorized!');
    }
    else {
        try {
            jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
                if (err) {
                    return res.status(500).json({ message: "Internal server error!", success: false });
                }
                req.user = user;
                // console.log("req.user",req.user.id)
                // console.log("req.param",req.params.userId)
                if (!req.user.isAdmin && req.user.id != req.params.userId) {
                    return res.status(403).json({ message: 'User is not allowed to delete  the account', success: false });
                }
                try {
                    await User.findByIdAndDelete(req.params.userId);
                    res.status(200).json({ message: 'User has been deleted successfully', success: true })
                } catch (error) {
                    return res.status(500).json({ message: error.message, success: false });
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false });
        }
    }
})
app.post('/api/signout', async (req, res) => {
    try {
        res.clearCookie('access_token').status(200).json({ message: 'User has been signout successfully', success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
})
app.post('/api/createpost', (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json('Unauthorized!');
    }
    else {
        try {
            jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
                if (error) {
                    return res.status(500).json({ message: error.message, success: false });
                }
                req.user = user
                if (!req.user.isAdmin) {
                    return res.status(403).json({ message: 'You are not authorised to create a post!', success: false, statusCode: 403 });
                }
                if (!req.body.title || !req.body.content) {
                    return res.status(403).json({ message: 'Please provide all the details for publishing the post!' });
                }
                const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
                const newPost = new Post({
                    ...req.body, slug, userId: req.user.id
                })
                try {
                    const savedPost = await newPost.save();
                    return res.status(201).json({ message: 'Blog has been saved successfully', success: true, savedPost })
                } catch (error) {
                    return res.status(500).json({ message: error.message, success: false });
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false });
        }
    }
})
app.get('/api/getpost', async (req, res) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortOrder = req.query.order === 'asc' ? 1 : -1;
        const query = {};

        if (req.query.userId) {
            query.userId = req.query.userId;
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.slug !== null && req.query.slug !== undefined) {
            query.slug = req.query.slug.trim();
        }

        if (req.query.postId) {
            query._id = req.query.postId;
        }
        if (req.query.searchterm) {
            query.$or = [
                { title: { '$regex': req.query.searchterm, $options: "i" } },
                { content: { '$regex': req.query.searchterm, $options: "i" } }
            ];
        }
        const posts = await Post.find(query).sort({ updatedAt: sortOrder }).skip(startIndex).limit(limit);
        const totalPost = await Post.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthPost = await Post.countDocuments({
            createdAt: { $gt: oneMonthAgo }
        })
        res.status(200).json({
            lastMonthPost,
            totalPost,
            posts
        })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
})
app.post('/api/deletepost/:postId/:userId', async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json('Unauthorized!');
    }
    else {
        try {
            jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
                if (error) {
                    return res.status(500).json({ message: error.message, success: false });
                }
                req.user = user
                if (!req.user.isAdmin || req.user.id != req.params.userId) {
                    return res.status(403).json({ message: 'You are not authorised to delete a post!', success: false, statusCode: 403 });
                }
                try {
                    const deletedPost = await Post.findByIdAndDelete(req.params.postId)
                    if (!deletedPost) {
                        return res.status(404).json({ message: 'Post not found' });
                    }
                    else {
                        return res.status(201).json({ message: 'post deleted successfully', success: true, deletedPost })
                    }
                } catch (error) {
                    return res.status(500).json({ message: error.message, success: false });
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false });
        }
    }
})
app.put('/api/updatepost/:postId/:userId', async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json('Unauthorized!');
    }
    else {
        try {
            jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
                if (error) {
                    return res.status(500).json({ message: error.message, success: false });
                }
                req.user = user
                if (!req.user.isAdmin || req.user.id != req.params.userId) {
                    return res.status(403).json({ message: 'You are not authorised to update a post!', success: false, statusCode: 403 });
                }
                try {
                    const updatePost = await Post.findByIdAndUpdate(
                        req.params.postId,
                        {
                            $set: {
                                title: req.body.title,
                                content: req.body.content,
                                image: req.body.image,
                                category: req.body.category
                            }
                        },
                        { new: true }
                    )
                    if (!updatePost) {
                        return res.status(404).json({ message: 'Post not found' });
                    }
                    else {
                        return res.status(201).json({ message: 'Post has been updated successfully!', success: true, updatePost })
                    }
                } catch (error) {
                    return res.status(500).json({ message: error.message, success: false });
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false });
        }
    }
})
app.get('/api/getusers', async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json('You are not allow to fetch user data!');
    }
    else {
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 9;
            const sortOrder = req.query.order === 'asc' ? 1 : -1;
            const userDoc = await User.find().sort({ createdAt: sortOrder }).skip(startIndex).limit(limit);
            const users = userDoc.map((user) => {
                const { password, ...otherUserData } = user._doc;
                return otherUserData;
            })
            const totalUser = await User.countDocuments();
            const now = new Date()
            const oneMonthAgoUser = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                now.getDate()
            )
            const lastMonthUser = await User.countDocuments({
                createdAt: { $gt: oneMonthAgoUser }
            })
            if (!userDoc) {
                return res.json({ message: "Users not found!" })
            }
            else {
                return res.json({ users, success: true, totalUser, lastMonthUser })
            }
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false });
        }
    }
})

app.post('/api/createcomment', async (req, res) => {
    const token = req.cookies.access_token;
    const {userId,postId,content}=req.body;
    if (!token) {
        return res.status(401).json('Unauthorized!');
    }
    else {
        try {
            jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
                if (error) {
                    return res.status(500).json({ message: error.message, success: false });
                }
                req.user = user
                if (userId !=req.user.id ) {
                    return res.status(403).json({ message: 'You are not authorised to comment  on post!', success: false, statusCode: 403 });
                }
                try {
                   const newComment=new Comment({
                    content,postId,userId
                   })
                   const commentDoc=await newComment.save();

                    if (!commentDoc) {
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    else {
                        return res.status(201).json({ message: 'Comment been updated successfully!', success: true, commentDoc })
                    }
                } catch (error) {
                    return res.status(500).json({ message: error.message, success: false });
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false });
        }
    }
})
app.get('/api/getpostcomments/:postId',async (req,res)=>{
try {
    const comments= await Comment.find({postId:req.params.postId}).sort({
        createdAt:-1
    })
    if(!comments){
        return res.status(404).json("No comments found")
    }
    else{
        return res.status(200).json({comments,statusCode:200,success:true})
    }
    
} catch (error) {
    return res.status(500).json({ message: error.message, success: false });
}
})
app.get('/api/:userId',async (req,res)=>{
    try {
       const user= await User.findById(req.params.userId); 
       if(!user){
        return  res.status(404).json({message: "User not Found",statusCode:404});
       }
       else{
        const {password,...rest}=user._doc;
        return res.status(201).json({rest,success:true})
       }
     
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
    })

app.put('/api/likecomment/:commentid',(req,res)=>{
    const token = req.cookies.access_token;
    const {userId,postId,content}=req.body;
    if (!token) {
        return res.status(401).json('Unauthorized!');
    }
    else{
        try {
            jwt.verify(token,process.env.JWT_SECRET,async(error,user)=>{
                if(error){
                    return res.status(500).json({message:'Server Error',statusCode:500,success:false});
                }
                else{
                    req.user=user
                    console.log("userId",userId)
                    console.log("requserid",req.user.id)
                    if (userId !=req.user.id ) {
                        return res.status(403).json({ message: 'You are not authorised to like on this post!', success: false, statusCode: 403 });
                    }
                    const comment=await Comment.findById(req.params.commentid)
                    if(!comment){
                        return res.status(404).json({message:'Comment not found',success:true,statusCode:404})
                    }
                    const userIndex=comment.likes.indexOf(req.user.id);
                    if(userIndex===-1){
                        comment.noOfLikes+=1
                        comment.likes.push(req.user.id)
                    }
                    else{
                        comment.noOfLikes-=1
                        comment.likes.splice(userIndex,1)
                    }
                    await  comment.save()
                    return res.status(200).json({message:'User like this post',success:true,comment})

                }
            })
            
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false });
        }
    }

})    
app.listen(3001, () => {
    console.log("server is running on port 3001!!")
})