const express =require('express');
const mysql=require('mysql');
 

const app=express();




const con=mysql.createConnection({
  host:'localhost',
  user:'shalini',
  password:'',
  port:4242,
   database:'projDB'
});


//connect

con.connect((err)=>{
  if(err) 
  {throw err;}
  console.log('mySql connected');
 
});

app.get('/hii',(req,res)=>{
  //res.send('sqlhbjldbld.......');
  let sql='CREATE DATABASE projDB';
  con.query(sql,(err,result)=>{
    if(err) {throw err;}
    console.log(result);
    res.send('database creation successfully');
  });

});

app.listen('4242',() => {
   console.log('Server is running....');
});