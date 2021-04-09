const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3wbxy.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;

const app = express()
app.use(express.json());
app.use(cors())


const port = 5000



const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("emaJohnStore").collection("Products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");
     
    app.post('/addProduct', (req, res)=>{
        const product = req.body;
        productCollection.insertMany(product)
        .then(result =>{
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })

    app.get('/products', (req, res) =>{
        productCollection.find({})
        .toArray((err, documents) =>{
            res.send(documents);
        })
    })

    app.get('/singleProduct/:key', (req, res) =>{
        productCollection.find({key: req.params.key})
        .toArray((err, documents) =>{
            res.send(documents[0]);
        })
    })

    app.post('/productByKeys', (req, res)=>{
        const productKeys = req.body;
        productCollection.find({key: { $in: productKeys}})
        .toArray((err, document) =>{
            res.send(document);
        })
    })

    app.post('/addOrder', (req, res)=>{
        const order = req.body;
        productCollection.insertMany(order)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
    })

});






app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)