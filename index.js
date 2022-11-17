const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const port=process.env.PORT ||5006;
const app=express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('server in running')
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.icjdeya.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

app.listen(port,()=>{
    console.log('listening ',port);
});