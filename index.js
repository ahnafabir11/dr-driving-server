require('dotenv').config()
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.send("Welcome To Dr. Driving's Server")
})

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`)
})