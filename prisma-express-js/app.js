import express from 'express';
import request from 'supertest';

const app = express();

app.listen(3000, ()=>{
  console.log("Server is running");
})

app.get('/', (req, res)=>{
  res.send("Halo this is server");
})