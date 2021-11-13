const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// name: taarzan
// password: FmmotReMFBKByPee

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s8i5p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("taarzan");
        const reviewsCollection = database.collection("reviews");
        const carsCollection = database.collection("cars");

        ////////////////////////
        // CARS API HANDLING //
        //////////////////////

        // GETTING CARS DATA
        app.get('/cars', async (req, res) => {
            const cursor = carsCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
        })
        // GETTING SINGLE CAR DATA
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cars = await carsCollection.findOne(query);
            res.send(cars);
        })

        /////////////////////////////////

        //////////////////////////
        // REVIEW API HANDLING //
        ////////////////////////

        // GETTING REVIEW DATA
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        // ADDIND REVIEW DATA
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        })
        //////////////////////////////////
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Congratulations! Api started');
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})