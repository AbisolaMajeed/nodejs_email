		
		const express = require("express");
		const bodyParser = require("body-parser");
		const mongoose = require("mongoose");
		const ejs = require("ejs");
		var nodemailer = require("nodemailer");

		const app = express();
		app.set('view engine', 'ejs');
		app.use(bodyParser.urlencoded({extended:true}));

		mongoose.connect("mongodb://localhost:27017/emailProject", {useUnifiedTopology: true, useNewUrlParser: true,});
		
		const memberSchema = new mongoose.Schema({
			firstname: String,
			lastname: String,
			email: String,
			phone: Number,
			password: String,
			state: String
		});

		 const Member = new mongoose.model("Member", memberSchema);

		 let user = [];

		app.get("/", function(req, res){
			res.sendFile(__dirname + "/registration.html");

		});

		app.get("/home", function(req, ress){
			res.render("home", {NewHomeMessage:homeMessage});
		})

		app.get("/login", function(req, res){
			res.sendFile(__dirname + "/login.html");
		});


		app.post("/registration", function(req,res){
			let fname = req.body.fname;
			let lname = req.body.lname;
			let email = req.body.email;
			let phone = req.body.tell;
			let password = req.body.pword;
			let state = req.body.state;
			// console.log(req.body);


			const member = new Member({
				firstname : fname,
				lastname : lname,
				email : email,
				phone : phone,
				password : password,
				state : state,
			});
		
			member.save();

			var transporter = nodemailer.createTransport({
		 	 service: 'gmail',
		 	 auth: {
		    	user: 'youremail@gmail.com',
		    	pass: 'yourpassword'
		  	}
			});

		 var mailOptions = {
                from: 'abisola.majeed@gmail.com',
                to:email,
                subject: 'Registration Successful',
                text: 'Dear' + " " + fname + " " + lname + ", your registration is Successful. Thanks for signing up."
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              }); 
			res.send("Registration Successful");
		});

		app.post("/login", function(req,res){

			let email = req.body.email;
			let password = req.body.pword;
			
			//var Email = mongoose.model('email', memberSchema);
			//var Password = mongoose.model('password', memberSchema);
	
			// console.log(req.body);
			
			//console.log(email);
			//console.log(password);
			
			const homeMessage = "Welcome" + " " + email + ". " + "Thanks for logging in!";

			Member.find({email:email, password:password}, function(error, result){
				//console.log(result)

					if(error){
						console.log(error);
					}	else {
						res.render("home", {NewHomeMessage:homeMessage});
						//res.redirect("/home");
					}	
			});

			
		});

		app.listen(3030, function(req, res){
			console.log("server running on port 3030");
		})