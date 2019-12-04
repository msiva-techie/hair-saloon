'use strict';
const express =require('express');
const mysql=require('mysql');
const fs=require('fs');
const mustache=require('mustache');
const path=require('path');
let mustacheExpress = require('mustache-express');

 

const app=express();

//mustache
app.engine('html', mustacheExpress());
app.set("view engine", "html");
app.set("views", path.join(__dirname, "/"));


const con=mysql.createConnection({
  host:'localhost',
  user:'root',
  port:3306,
  password:'1saltakhiH',
  database:'proj_DB'
});


//  app.get('/',(req,res)=>{
//    return res.sendFile(__dirname+'/src/views/pushData.html');
//  });



//connect
app.get('/',(req,res)=>{
  con.connect((err)=>{
  if(!err){
    console.log('mySql connected');
    con.query('select * from sampleTable where ID=22',(err,rows)=>{
       if(!err) {
         var result=rows[0].Name;
         var ID=rows[0].ID;
         console.log(result);
         console.log(ID);
        res.render('pushData',{result,ID});
        }
        else {
          throw err;
        } 
    })
   }
 })
});

app.listen(4242, () => {
  console.log ('Listening....');
});