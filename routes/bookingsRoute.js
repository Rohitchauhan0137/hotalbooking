const express = require('express');
const moment = require('moment');
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const Booking = require('../models/booking')
const Room = require('../models/room');

router.post('/bookRoom', async (req, res) => {
    const { totalAmount, fromDate, toDate, roomId, userId, token,
        roomName,
        userName,
        totalDays,
    } = req.body;
    const formatedFromDate = moment(fromDate).format('DD-MM-YYYY');
    const formatedToDate = moment(toDate).format('DD-MM-YYYY');
    const bookingReqData = {
        totalAmount,
        fromDate: formatedFromDate,
        toDate: formatedToDate,
        roomId,
        userId,
        roomName,
        userName,
        totalDays,
        transactionId: ''
    };

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })

        const payment = await stripe.charges.create({
            amount: totalAmount * 100,
            customer: customer.id,
            currency: "INR",
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4()
        })
        if (payment) {
            bookingReqData.transactionId = payment.id
            const newBooking = new Booking(bookingReqData)
            const booking = await newBooking.save()
            const room = await Room.findOne({ _id: roomId })
            room.currentBookings.push({
                bookingId: booking._id,
                fromDate: formatedFromDate,
                toDate: formatedToDate,
                userId: userId,
                status: booking.status
            })
            await room.save()
            return res.send(booking)
        }
        res.send('Payment Successfull!')
    } catch (error) {
        return res.status(400).json({ error })
    }
})


router.post('/getBookingsByUserId', async (req, res) => {
    const userId = req.body.userId;
    try {
        const bookings = await Booking.find({ userId: userId })
        return res.send(bookings)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.post('/cancelBooking', async (req, res) => {
    const { bookingId, roomId } = req.body;
    try {
        const bookingItem = await Booking.findOne({ _id: bookingId })
        bookingItem.status = 'Cancelled'
        await bookingItem.save();

        const room = await Room.findOne({ _id: roomId })

        const currentBookings = room.currentBookings;

        const filteredCurrentBooking = currentBookings.filter(book => book.bookingId.toString() !== bookingId)
        room.currentBookings = filteredCurrentBooking;
        await room.save();

        return res.send('Your booking cancelled successfully')
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.get('/getAllBooking', async (req, res) => {
    try {
        const allBookings = await Booking.find()
        return res.send(allBookings);
    } catch (error) {
        return res.status(400).json({ error })
    }
})

module.exports = router;