'use strict';
const mustache=require('mustache');
const path=require('path');
let mustacheExpress = require('mustache-express');
var http = require('http');
var fs=require('fs');
const express =require('express');
const mysql=require('mysql');
const bodyparser=require('body-parser');
const session=require('express-session');
const nodemailer=require('nodemailer')

const app=express();

app.use(bodyparser.json());
var urlencoded=app.use(bodyparser.urlencoded({
    extended:true
}));


//node mailer
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shaliniggu@gmail.com',
    pass: 'yesyoucandoitSHALINI'
  }
});

app.use(session({
	secret:'secret',
	resave: true,
	saveUninitialized: true
}));


//mustache
app.engine('html', mustacheExpress());
app.set("view engine", "html");
app.set("views", path.join(__dirname, "/"));

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


//connect
con.connect((err)=>{
  if(err) 
  throw err;
  console.log('mySql connected');
});

//get login
app.get('/',(req,res)=>{
  
  app.use('/split.css',express.static(__dirname +'/split.css'));
  app.use('/logo.jpg',express.static(__dirname+'/logo.jpg'));
  app.use('/emp.png',express.static(__dirname+'/emp.png'));
  return res.sendFile(__dirname+'/split.html');


});
//get login
app.get('/services',(req,res)=>{
  
  app.use('/services.css',express.static(__dirname +'/services.css'));
  app.use('/h1.jpeg',express.static(__dirname+'/h1.jpeg'));
  app.use('/h2.jpeg',express.static(__dirname+'/h2.jpeg'));
  app.use('/h3.jpg',express.static(__dirname+'/h3.jpg'));
  app.use('/h4.jpg',express.static(__dirname+'/h4.jpg'));
  return res.sendFile(__dirname+'/services.html');


});

//get login
app.get('/login',(req,res)=>{
  
    app.use('/login.css',express.static(__dirname +'/login.css'));
    app.use('/logo.jpg',express.static(__dirname+'/logo.jpg'));
    return res.sendFile(__dirname+'/login.html');
});


//get login
app.get('/update',(req,res)=>{
  
  app.use('/update.css',express.static(__dirname +'/update.css'));
  //app.use('/logo.jpg',express.static(__dirname+'/logo.jpg'));
  return res.sendFile(__dirname+'/update.html');
});

//get login
app.get('/about',(req,res)=>{
  
  app.use('/about.css',express.static(__dirname +'/about.css'));
  //app.use('/logo.jpg',express.static(__dirname+'/logo.jpg'));
  return res.sendFile(__dirname+'/about.html');
});

// get signup
app.get('/signup',(req,res)=>{
  app.use('/signup.css',express.static(__dirname +'/signup.css'));
  return res.sendFile(__dirname+'/signup.html');
});




  //post signup
  app.post('/signup',(req,res,)=>{
  
    var name=req.body.Username;
    var email=req.body.email;
    var pwd1=req.body.password1;
    var pwd2=req.body.password2;
    con.query('SELECT count(*) AS cnt FROM signUp WHERE UserName =? and Email=?',[name,email],function(error,rows){
      if(error){throw error}
      else{
        if (rows[0].cnt<=0) {
           var sql="insert into signUp (UserName,Email,Password) values ('"+name+"','"+email+"','"+pwd1+"')";
           con.query(sql,(err,result)=>{
             if (!err)
                {
                 console.log('Inserted');
                 res.send("Signup successful, Login to continue........!!!!")
                 //res.redirect('/');
                 }
             });
        }
        else{
          res.send('Username or email already exists');
          //res.redirect('/');
         
            }
          }
    });
  });

//post log in
app.post('/login',(req,res,)=>{

    var username=req.body.username;
    var password=req.body.password;

		con.query('SELECT count(*) AS cnt FROM signUp WHERE UserName = ? AND Password = ?', [username, password], function(error, fields) {
      if(!error){
         if (fields[0].cnt<=0) {
           res.send('Username and/or Password does not match!');
				   //response.redirect('/');
		  	  } else {
             req.session.loggedin = true;
              con.query('UPDATE Login SET UserName=? WHERE no=1',[username],function(err,fields){
               if(err){throw err}
               else{
                console.log('updated');
                res.end();
               }
              });
           res.redirect("http://localhost:4242/main");
          //req.session.UserName = username;
			}			
			  }
  });
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
          //res.send("Your Booking has been cancelled");
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
           res.redirect("http://localhost:4242/timeslot1");
           
           }    
    });
  });


  app.get('/timeslot1',(req,res,fields)=>{
    app.use('/timeslot1.css',express.static(__dirname +'/timeslot1.css'));
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
       
       res.redirect("http://localhost:4242/booking3");
       
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
      var mailOptions = {
        from: 'shaliniggu@gmail.com',
        to: 'cuteshalu95.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
       console.log('Inserted inserted client details'); 
       res.send("your booking has been confirmed!!"); 
      }  
});
}); 



    

app.listen(4242,()=>{
        console.log('Listening...');
    });

