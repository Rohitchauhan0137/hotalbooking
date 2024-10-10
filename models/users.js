const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
}, { timestamp: true })

const usersModel = mongoose.model('users', usersSchema)

module.exports = usersModel;