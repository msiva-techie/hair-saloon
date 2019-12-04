var http = require('http');
var fs=require('fs');
const express =require('express');
const mysql=require('mysql');
const path=require('path');
const bodyparser=require('body-parser');

const app=express();


const con=mysql.createConnection({
  host:'localhost',
  user:'root',
  port:3306,
  password:'1saltakhiH',
  database:'proj_DB'
});


//connect
con.connect((err)=>{
    if(err) 
    throw err;
    console.log('mySql connected');
           var sql="(CREATE TABLE IF NOT EXISTS `proj_DB.checkTable`(`Name` varchar(300),`address` varchar(60))";
        con.query(sql,(error,result,fields)=>{
           if (error) {throw error;}
           else
            {
               console.log('created');}
              // res.end();
            });
    });



app.listen(4242,()=>{
        console.log('Listening...');
    });

    