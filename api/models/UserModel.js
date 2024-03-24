const { timeStamp } = require("console");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture:{
      type:String,
      default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fprofile-image&psig=AOvVaw3ciK4lx1OiHugqe6LyqOhH&ust=1711385225061000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLiOm_OsjYUDFQAAAAAdAAAAABAE"
    }
  },
  { timestamps: true }
);
const user= mongoose.model('user', userSchema)
module.exports=user
