require('dotenv').config()
const express = require('express')
const db = require('./models')
const path = require('path')
const clc = require('cli-color')
const cookieParser = require('cookie-parser')
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/public", express.static(path.join(__dirname, "../public")));
// app.use(session({secret:process.env.SECRACT}))

app.use('/api', require('./router'))

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${clc.green.underline(port)}`)
})