const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iknar0j.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const foodCollection = client.db('resturantDB').collection('allFood');
    const orderCollection = client.db('resturantDB').collection('order');

    app.get('/order', async(req, res) =>{
      const result = await orderCollection.find().toArray();
      res.send(result)
    })

    app.post('/order', async(req, res) =>{
      const orderFoodDetails = req.body;
      console.log(orderFoodDetails);
      const result = await orderCollection.insertOne(orderFoodDetails);
      res.send(result);
    })

    app.delete('/order/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/allfood', async(req, res) =>{
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);


        const result = await foodCollection.find()
        .skip(page * size)
        .limit(size)
        .toArray();
        
        res.send(result);
    })

    app.get('/allFoodCount', async(req, res) =>{
      const count = await foodCollection.estimatedDocumentCount();
      res.send({count});
    })

    app.get('/allfood/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await foodCollection.findOne(query);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Resturant management website server is continued..')
})

app.listen(port, () =>{
    console.log(`Resturant mgmt is running on port: ${port}`)
})