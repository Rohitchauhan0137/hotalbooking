const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    roomName: { type: String, required: true },
    roomId: { type: String, required: true },
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    totalDays: { type: Number, required: true },
    transactionId: { type: String, required: true },
    status: { type: String, required: true, default: 'Confirmed' },
}, { timestamp: true })

const bookingModel = mongoose.model('bookings', bookingSchema)

module.exports = bookingModel;