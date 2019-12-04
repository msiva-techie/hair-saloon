let mustacheExpress = require('mustache-express');var http = require('http');
var fs=require('fs');
const express =require('express');
const mysql=require('mysql');
const path=require('path');
const bodyparser=require('body-parser');
const session=require('express-session');

const app=express();

app.use(bodyparser.json());
var urlencoded=app.use(bodyparser.urlencoded({
    extended:true
}));

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

// //get
app.get('/main',(req,res)=>{
    app.use('/main.css',express.static(__dirname +'/main.css'));
  return res.sendFile(__dirname+'/main.html');  
});

//post
app.post('/main',(req,res,fields)=>{


    var sql1="SELECT UserName FROM Login WHERE no=1";
    con.query(sql1,(err,rows)=>{
        if(err){throw err}
        else{ 
            var username=rows[0].UserName;
            console.log(username);
        }
    
    con.query('select Sno,Email,FirstName,Date,Service,Stylist,Slot from Booking where UserName=?',[username],function(error,rows){
      if(error){throw error}
      else{
         var rw=JSON.stringify(rows); 
         res.render('main',{rw}); 
        // res.redirect('http://localhost:4242/booking2');
          }
        });

    });
  });

//post
app.post('/delete',(req,res,fields)=>{
 var bid1=req.body.bid;
 console.log(bid1);

    //var sql1=" UserName FROM Login WHERE no=1";
    con.query('delete from Booking where Sno=?',[bid1],(err,rows)=>{
        if(err){throw err}
        else{ 
          
            console.log("deleted");
            res.redirect("/main");
            res.send("Your Booking has been cancelled");
        }
    });
});



  //listen
app.listen(4242,()=>{
    console.log('Listening...');
});