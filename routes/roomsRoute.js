const express = require('express');
const router = express.Router();

const Room = require('../models/room');

router.get('/getAllRooms', async (req, res) => {
    try {
        const rooms = await Room.find({})
        return res.send(rooms)
    } catch (error) {
        return res.status(400).json({ message: error })
    }
})

router.post('/getRoomById', async (req, res) => {
    const roomId = req.body.roomId;
    try {
        const room = await Room.findOne({ _id: roomId })
        return res.send(room)
    } catch (error) {
        return res.status(400).json({ message: error })
    }
})

router.post('/createRoom', async (req, res) => {
    const { name, maxCount, phoneNumber, rentPerDay, rating, imageUrls, type, description } = req.body;
    const roomReqData = {
        name,
        maxCount,
        phoneNumber,
        rentPerDay,
        rating,
        imageUrls,
        type,
        description,
        currentBookings: []
    };
    try {
        const newRoom = new Room(roomReqData)
        const room = await newRoom.save()
        return res.send(room)
    } catch (error) {
        return res.status(400).json({ message: error })
    }
})

module.exports = router;