const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5006;
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('server in running')
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.icjdeya.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try { 
         const serviceCollection=client.db('geniusCar').collection('services');
         const orderCollection=client.db('geniusCar').collection('order');
         app.get('/service',async(req,res)=>{
            const query={};
            const cursor=serviceCollection.find(query);
            const services=await cursor.toArray();
            res.send(services);
         })
         app.get('/service/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const service=await serviceCollection.findOne(query);
            res.send(service);
         })
         //order api
         app.post('/orders',async(req,res)=>{
            const order=req.body;
            const result=await orderCollection.insertOne(order);
            res.send(result);
         })
         app.get('/orders',async(req,res)=>{
            let query={};
            if(req.query.email){
                query={
                    email:req.query.email
                }
            }
            const cursor=orderCollection.find(query);
            const orders=await cursor.toArray();
            res.send(orders);
         })
    } finally {

     }
}
run().catch(e => console.log(e));
app.listen(port, () => {
    console.log('listening ', port);
});