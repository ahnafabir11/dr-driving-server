require('dotenv').config()
const cors = require('cors')
const express = require('express')
const fileUpload = require('express-fileupload')
const MongoClient = require('mongodb').MongoClient

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(fileUpload())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send("Welcome To Dr. Driving's Server")
})


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.swwce.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admins");
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("service");
  const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");

  app.post('/allorders', (req, res) => {
    const email = req.body.email;
    adminCollection.find({email})
      .toArray((err, admins) => {
        if(admins.length) {
          orderCollection.find()
            .toArray((err, orders) => {
              res.send(orders)
            })
        }
      })

    
  })

  app.post('/orders', (req, res) => {
    const email = req.body.email;

    orderCollection.find({ email })
      .toArray((err, orders) => {
        res.send(orders)
      })
  })

  app.post('/addorder', (req, res) => {
    const orderData = req.body;
    orderCollection.insertOne(orderData)
      .then(result => {
        res.status(200).send(result.insertedCount > 0)
      })
  })

  app.put('/updatestatus', (req, res) => {
    const orderStatus = req.body.orderStatus;
    const paymentId = req.body.paymentId;
    orderCollection.updateOne(
      {paymentId},
      { $set: { orderStatus}}
    )
    .then(result => {
      res.status(200).send(true)
    })
  })

  app.get('/services', (req, res) => {
    serviceCollection.find()
      .toArray((err, services) => {
        res.send(services)
      })
  })

  app.post('/addservice', (req, res) => {
    const {title, classes, duration, price} = req.body;
    const file = req.files.file;
    
    const newImg = file.data;
    const encImg = newImg.toString('base64')

    const icon = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    }

    serviceCollection.insertOne({title, classes, duration, price, icon})
      .then(result => {
        res.status(200).send(result.insertedCount > 0)
      })
    
  })
  app.post('/admins', (req, res) => {
    const email = req.body;
    adminCollection.find(email)
      .toArray((err, admins) => {
        res.status(200).send(admins.length > 0)
      })
  })

  app.post('/addadmin', (req, res)=> {
    const adminData = req.body;
    adminCollection.insertOne(adminData)
      .then(result => {
        res.status(200).send(result.insertedCount > 0)
      })
  })

  app.get('/reviews', (req, res)=> {
    reviewCollection.find()
      .toArray((err, reviews)=> {
        res.send(reviews)
      })
  })

  app.post('/addreview', (req, res)=> {
    const review = req.body;
    reviewCollection.insertOne(review)
      .then(result => {
        res.status(200).send(result.insertedCount > 0)
      })
  })

});


app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`)
})