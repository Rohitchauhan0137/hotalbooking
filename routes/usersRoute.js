const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Users = require('../models/users');

router.post('/register', async (req, res) => {
    // const newUser = new Users(req.body);
    const newUser = new Users({ name: req.body.name, email: req.body.email, password: req.body.password, isAdmin: req.body.isAdmin })
    try {
        await newUser.save()
        return res.send('User Created Successfully!')
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email: email, password: password })
        if (user) {
            const accessToken = jwt.sign(user.name, process.env.ACCESS_TOKEN_SECRET)
            let userData = {
                name: user.name,
                userId: user._id,
                isAdmin: user.isAdmin,
                accessToken: accessToken,
                email: user.email
            }
            return res.send(userData)
        } else {
            return res.status(404).json({ message: "User or Password not matched, please try again" })
        }
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.get('/getAllUsers', async (req, res) => {
    try {
        const allUser = await Users.find()
        return res.send(allUser)
    } catch (error) {
        return res.status(400).json({ error }) 
    }
})

module.exports = router;