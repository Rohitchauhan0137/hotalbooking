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

module.exports = router;