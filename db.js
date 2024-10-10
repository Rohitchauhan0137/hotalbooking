const mongoose = require('mongoose');
require('dotenv').config()

const mongoDBUrl = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@cluster0.eh7k0.mongodb.net/HotalBooking`

mongoose.connect(mongoDBUrl);

const mongoConnect = mongoose.connection;

mongoConnect.on('error', (error)=> console.log("MongoDB Connection Failed!!", error))

mongoConnect.on('connected', ()=> console.log("MongoDB Connected Successfully!!"))


module.exports = mongoose;