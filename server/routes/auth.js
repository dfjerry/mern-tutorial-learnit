require('dotenv').config() // lay du lieu tu .env
const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth')
const User = require('../models/User')

// @route GET api/auth
// @desc check if user is logged in
// @access public
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) return res.status(400).json({success: false, message: 'user not found'})
        res.json({success:true, user})
    }catch (error){
        console.log(error)
        res.status(500).json({success:false, message: "Internal server error"})
    }
})

//@route POST api/auth/register
//@desc Register user
//@access Public
router.post('/register', async (req, res) => {
    const {username, password} = req.body

    //Simple validation
    if (!username || !password)
        return res
            .status(400)
            .json({success: false, message: 'Missing username and password'})
    try{
        //Check for existing user
        const user = await User.findOne({username})
        if (user)
            return res
                .status(400)
                .json({success: false, message: 'Username alredy'})
        //All good
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({
            username,
            password: hashedPassword
        })
        await newUser.save()
        //Return token cho client
        const accessToken = jwt.sign(
            {userId: newUser._id},
            process.env.ACCESS_TOKEN_SECRET)//data dua vao access token
        res.json({success:true, message: "user created successfully", accessToken})
    }catch (error){
        console.log(error)
        res.status(500).json({success:false, message: "Internal server error"})
    }
})

//@route POST api/auth/register
//@desc Register user
//@access Public
router.post('/login', async (req, res) => {
    const {username, password} = req.body

    //Simple validation
    if (!username || !password)
        return res
            .status(400)
            .json({success: false, message: 'Missing username and password'})
    try{
        //check for existing user
        const user = await User.findOne({username})
        if (!user)
            return res.status(400).json({success: false, message: 'Incorrect'})
        //Username found
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid)
            return res.status(400).json({success: false, message: 'Incorrect username or password'})
        //All good
        //Return token cho client
        const accessToken = jwt.sign(
            {userId: user._id},
            process.env.ACCESS_TOKEN_SECRET
        )//data dua vao access token
        res.json({
            success:true,
            message: "Logged is successfully",
            accessToken
        })
    }catch (error){
        console.log(error)
        res.status(500).json({success:false, message: "Internal server error"})
    }
})

module.exports = router
