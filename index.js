const express = require('express');
const cors = require('cors');
const jwt=require('jsonwebtoken');
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
function verifyJWT(req,res,next){
     const authHeader=req.headers.authorization;
     if(!authHeader){
        return res.status(401).send({message:'unauthorized access'});
     }
     const token=authHeader.split(' ')[1];
     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,function(err,decoded){
        if(err){
            return res.status(401).send({message:'unauthorized access'});
        }
        req.decoded=decoded;
        next();
     })
}
// function verifyJWT(req,res,next){
//     const authHeader= req.headers.authorization;
//     if(!authHeader){
//         res.status(401).send({message:'unauthorized access'});
//     }
//     const token=authHeader.split(' ')[1];
//     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,function(err,decoded){
//         if(err){
//             res.status(401).send({message:'unauthorized access'});
//         }
//         req.decoded=decoded;
//         next();
//     })
// }
async function run() {
    try {
        const serviceCollection = client.db('geniusCar').collection('services');
        const orderCollection = client.db('geniusCar').collection('order');
        //jwt
        app.post('/jwt',(req,res)=>{
            const user=req.body;
            console.log(user);
            const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'5h'});
            res.send({token});
        })
        app.get('/service', async (req, res) => {
            const query = {};
            const order=req.query.order;
            console.log(order);
            const cursor = serviceCollection.find(query).sort({price:order});
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
        //order api
        app.post('/orders',verifyJWT,async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
        app.get('/orders', verifyJWT,async (req, res) => {
            const decoded=req.decoded;
            console.log('inside order api',decoded);
            if(decoded.email!==req.query.email)
            {
                res.send({message:'unauthorized access'});
            }
            console.log(req.headers.authorization);
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })
        app.delete('/orders/:id', verifyJWT,async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result=await orderCollection.deleteOne(query);
            res.send(result);
        })
        app.patch('/orders/:id',verifyJWT,async(req,res)=>{
            const id=req.params.id;
            const status=req.body.status;
            const query={_id:ObjectId(id)};
            const updatedDoc={
                $set:{
                    status:status
                }
            }
            const result=await orderCollection.updateOne(query,updatedDoc);
            res.send(result);
        })
    } finally {

    }
}
run().catch(e => console.log(e));
app.listen(port, () => {
    console.log('listening ', port);
});