const express = require('express');
const cors = require('cors');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const port=5006;
const app=express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('server in running')
})
app.listen(port,()=>{
    console.log('listening ',port);
});