const express= require('express');
const cors= require('cors');
const app= express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4cfgh.mongodb.net/emaJohn?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCol = client.db("emaJohn").collection("products");
  const ordersCol = client.db("emaJohn").collection("orders");
  console.log('connected');

  app.post('/addProduct', (req, res)=> {
      const allProducts= req.body;
      productsCol.insertMany(allProducts)
      .then(result=> res.send(`inserted:${result.insertedCount}`))
      .catch(err=> console.log(err))
  })

  app.get('/products', (req,res)=> {
   const result= productsCol.find({}).toArray();
   result.then(result=> res.send(result))
    
  })
  
  app.get('/product/:key', (req, res)=> {
    const key= req.params.key;
    productsCol.findOne({key: key})
    .then(result=> res.send(result))
    .catch(err=> console.log(err))
  })

  app.post('/keyProducts', (req, res)=> {
    const keys= req.body;
    productsCol.find({key: {$in: keys}}).toArray((err, docs)=> {
      res.send(docs);
    })
  })

  app.post('/addOrder', (req, res)=> {
    const order= req.body;
    ordersCol.insertOne(order)
    .then(result=> res.send(result.insertedCount>0))
    .catch(err=> console.log(err))
  })

});



app.get('/', (req, res)=> {
    res.send('salam , welcome');
})

app.listen(process.env.PORT || 5000);