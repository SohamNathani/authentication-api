const express = require("express")
const auth = require("../middleware/auth")
const multer = require("multer")
const sharp = require("sharp")
const User = require("../models/user")
const moment = require("moment")

const router = new express.Router()

router.post("/users", async (req,res)=>{
    req.body.dob = new Date(moment(req.body.dob, "MM-DD-YYYY"))
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post("/users/login", async (req, res)=>{
    try{
        const user  = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(404).send(e.message)
    }
})

router.post("/users/logout", auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter(token => token.token!==req.token)
        await req.user.save()
        res.send("Logout successful")
    }catch(e){
        res.status(500).send()
    }
})

router.post("/users/logoutall", auth, async(req, res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send("Logged out from all devices")
    }catch(e){
        res.status(500).send()
    }
})

router.get("/users/me", auth, async(req, res)=>[
    res.send(req.user)
])

const upload = multer({
    limits:1000000,
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/i)){
            return cb(new Error("File should be image"))
        }
        return cb(undefined, true)
    }
})

router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send("Image uploaded successfully")
},(error, req, res, next)=>{
    res.status(400).send("Error")
})

router.get("/users/me/avatar", auth, async(req, res)=>{
    try{
        if(!req.user.avatar) throw new Error("Avatar not found")
        res.set("Content-Type", "image/png")
        res.send(req.user.avatar)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router