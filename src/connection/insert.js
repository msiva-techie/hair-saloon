var http=require('http');
const express =require('express');
const mysql=require('mysql');
//const path=require('path');
//const router=express.Router;
const bodyparser=require('body-parser');

const app=express();

//app.use(bodyparser.json());
//var urlencoded=app.use(bodyparser.urlencoded({
  //  extended:true
//}));





const con=mysql.createConnection({
  host:'localhost',
  user:'root',
  //port:3306,
  password:'1saltakhiH',
  //database:'proj_DB'
});

//app.get('/',(req,res)=>{
  //  res.sendFile(path.join(__dirname+'/dataEntry.html'));
//});


//connect


con.connect((err)=>{
    if(err) 
    {
      throw err;
    }
    else{
    console.log('mySql connected');
    //}
  //});
  
  //app.post('/',(req,res)=>{
          var sql='insert into sampleTable (id,name,dept) values ("1","anjali","hcm")'
           con.query( sql,(err,result)=>{
           if (err) {
              console.log('fail');
              throw err;}
           else
           {
               console.log('Inserted');}
            });}
         

          //res.render('data',{title:'data savd',
       // message:'data saved successfully' }); }
      
      //res.end();
    });


app.listen(3607,()=>{
        console.log('Listening...');
    });