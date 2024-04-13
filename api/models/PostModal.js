const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const postSchema=new Schema({
    title:{type:String,required:true,unique:true},
    userId:{
        type:String,required:true
    },
    content:{
        type:String,required:true
    },
    image:{
        type:String,
        default:'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post-1536x674.webp'
    },
    category:{
        type:String,
        default:'select'
    },
    slug:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true});
//add user id to the schema so we can know who created a post 
const post=mongoose.model("Post",postSchema);
module.exports=post