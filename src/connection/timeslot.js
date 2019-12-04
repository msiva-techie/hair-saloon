'use strict';
const mustache=require('mustache');
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

//connection
const con=mysql.createConnection({
  host:'localhost',
  user:'root',
  port:3306,
  password:'1saltakhiH',
  database:'proj_DB'
});



app.get('/timeslot1',(req,res,fields)=>{
  var sql="select count(*) as cnt1 from TimeSlots S join Booking B on S.Stylist=B.Stylist WHERE S.TimeSlot not in (select Slot from Booking where Slot is not null and Stylist in (Select Stylist from Booking where Sno in (SELECT max(Sno) FROM Booking))) and (B.Date=CURRENT_DATE()) and (B.Stylist in (SELECT B.Stylist from Booking where B.Sno = (SELECT max(Sno) from Booking)))";
  con.query(sql,(err,fields)=>{
      if(err){throw err}
      else{
          var cnt=fields[0].cnt1;
          console.log("count........",fields);
          console.log("ghjjkhjjjh",cnt);
          var sql1="select S.TimeSlot from TimeSlots S join Booking B on S.Stylist=B.Stylist WHERE S.TimeSlot not in (select Slot from Booking where Slot is not null and Stylist in (Select Stylist from Booking where Sno in (SELECT max(Sno) FROM Booking))) and (B.Date=CURRENT_DATE()) and (B.Stylist in (SELECT B.Stylist from Booking where B.Sno = (SELECT max(Sno) from Booking)))";
           con.query(sql1,(err,rows)=>{
                 if(err){throw err}
                 else{ 
                  var x=[];
                        
                  for(var i=0;i<cnt;i++) {
                     x[i]=rows[i].TimeSlot;
                     console.log(x[i]);
                     }
          res.render('timeslot1',{x,cnt});
      
                   }   
                  });
         }
       });
   });



//post insert time slots
app.post('/timeslot1',(req,res,fields)=>{

var time=req.body.button_0; 
console.log(time);

con.query('UPDATE Booking SET Slot=? WHERE Sno in (Select max(Sno) from Booking)',[time],(error,fields)=>{
if(error){throw error}
else{
   console.log('Inserted TimeSlots');
   //res.redirect("http://localhost:4242/booking3");
   
  }		
});
});


//get booking 3
app.get('/booking3',(req,res)=>{
app.use('/booking3.css',express.static(__dirname +'/booking3.css'));
return res.sendFile(__dirname+'/booking3.html');  
}); 



//boooking3
app.post('/booking3',(req,res,fields)=>{

var email=req.body.mail;
var fn=req.body.fname;
var ln=req.body.lname;
var num=req.body.pno;
con.query('UPDATE Booking SET Email=?,FirstName=?,LastName=?,Number=? WHERE Sno in (Select max(Sno) from Booking)',[email,fn,ln,num], function(error, fields) {
if(error){throw error}
else{
   console.log('Inserted inserted client details');  
  }  
});
}); 


// //get
app.get('/booking1',(req,res)=>{
app.use('/booking1.css',express.static(__dirname +'/booking1.css'));
return res.sendFile(__dirname+'/booking1.html');  
});



//post
app.post('/booking1',(req,res,fields)=>{

var date=req.body.date;
var service=req.body.service;

var sql1="SELECT UserName FROM Login WHERE no=1";
con.query(sql1,(err,rows)=>{
    if(err){throw err}
    else{ 
        var username=rows[0].UserName;
        console.log(username);
    }
var sql="INSERT INTO Booking(UserName,Date,Service) values ('"+username+"','"+date+"','"+service+"')";
con.query(sql,function(error,rows){
  if(error){throw error}
  else{
     console.log('inserted');  
     res.redirect('http://localhost:4242/booking2');
      }
    });

});
});

//post
app.get('/booking2',(req,res,fields)=>{

app.use('/booking2.css',express.static(__dirname +'/booking2.css'));
var sql1="SELECT s.Emp1,s.Emp2 from ServiceEmp s join Booking b on s.Service=b.Service where b.Sno in (select MAX(Sno) from Booking)";
con.query(sql1,(err,rows)=>{
  if(err){throw err}
  else{ 
      var S1=rows[0].Emp1;
      var S2=rows[0].Emp2;
      res.render('booking2',{S1,S2});
      }
  });
});

app.post('/booking2',(req,res,fields)=>{
  var uname=req.body.gender; 
  console.log(uname);
  con.query('UPDATE Booking SET Stylist=? WHERE Sno in (Select max(Sno) from Booking)',[uname], function(error, fields) {
    if(error){throw error}
    else{
       console.log('Inserted Stylist');
       
       }    
});
});
//listen
app.listen(4242,()=>{
    console.log('Listening...');
});
