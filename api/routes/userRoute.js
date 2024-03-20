const express=require("express")
const { test } = require("../controller/usercontroller")
const router=express.Router()

router.get("/test2",test)
module.exports=router