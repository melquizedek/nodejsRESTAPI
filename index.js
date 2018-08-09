const express = require('express');
const app = express();
const fs = require("fs");
const cors = require('cors');
const bodyParser = require('body-parser');
const lodash = require('lodash');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post('/internal-api/auth', function (req, res) {
   // First read existing users.
   const username = req.body.username;
   const password = req.body.password;
   fs.readFile( __dirname + "/data/" + "customers.json", 'utf8', function (err, data) {
       let dataArr = JSON.parse(data);
	   let customer = lodash.filter(dataArr.customers, c => c.email == username && c.password === password);
	   let code = 403;
	   let result = {status: 0, message: "Username or password is incorrect", token: null};
	   if (customer.length) {
			code = 200;
			result = {status: 1, message: "ok", token: Buffer.from(JSON.stringify(customer)).toString('base64') }; 
	   }
	   res.send(code, result);
   });
})

app.get('/internal-api/policies', function(req, res) {
	fs.readFile( __dirname + "/data/" + "policies.json", 'utf8', function (err, data) {
		res.send(JSON.parse(data));
	});
})

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Internal server listening at http://%s:%s", host, port)
})