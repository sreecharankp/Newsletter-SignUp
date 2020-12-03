const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//api key
//be700d64f9455ec14d276ed3a2ede753-us7
//list id
//audience id: 70eb670041

app.post("/", function(req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  //console.log(fname + " - " + lname + " - " + email );
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const listId = "70eb670041";
  const url = "https://us7.api.mailchimp.com/3.0/lists/" + listId;

  const options = {
    method: "POST",
    //auth: "sreecharankp:be700d64f9455ec14d276ed3a2ede753-us7"
    auth: "sreecharankp:be700d64f9455ec14d276ed3a2ede753-us7"
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running in port 3000")
});
