var http = require('http');
var fs=require('fs');
const express =require('express');
const mysql=require('mysql');
const path=require('path');
//const router=express.Router;
const bodyparser=require('body-parser');

const app=express();

app.use(bodyparser.json());
var urlencoded=app.use(bodyparser.urlencoded({
    extended:true
}));


const con=mysql.createConnection({
  host:'localhost',
  user:'root',
  port:3306,
  password:'1saltakhiH',
  database:'proj_DB'
});


//get
app.get('/',(req,res)=>{
  return res.sendFile(__dirname+'/dataEntry.html');
});


//connect
con.connect((err)=>{
    if(err) 
    throw err;
    console.log('mySql connected');
  });


//post
app.post('/insert',(req,res,)=>{

    var id=req.body.id;
    var name=req.body.name;
    var dept=req.body.dept;

    res.write('You sent the id "' + req.body.id+'".\n');
    res.write('You sent the name "' + req.body.name+'".\n');
    res.write('You sent the dept "' + req.body.dept+'".\n');

           var sql="insert into sampleTable (ID,Name,dept) values ('"+id+"','"+name+"','"+dept+"')";
           con.query(sql,(err,result)=>{
           if (err) {throw err;}
           else
            {
               console.log('Inserted');}
               res.end();
            });
    });



app.listen(4242,()=>{
        console.log('Listening...');
    });

    