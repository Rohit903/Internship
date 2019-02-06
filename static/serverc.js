var express = require("express");
var mysql = require("mysql");
const dialogflow = require("dialogflow");
const uuid = require("uuid");
require("dotenv").config();
var bodyparser = require("body-parser");
var process = require("process");
var pool = mysql.createPool({
  connectionLimit: 1,
  host: "localhost",
  user: "rohit",
  password: "rohit@903",
  database: "db1"
});

//connection.connect()

var app = express();
var urlencodedparser = bodyparser.urlencoded({ extended: false });

const sessionId = uuid.v4();
console.log("loaded the uuuid package");

// Create a new session
const sessionClient = new dialogflow.SessionsClient();
console.log("session client created");
const sessionPath = sessionClient.sessionPath("global-bot", sessionId);
console.log("session path is created");
//used for rendering chatui page and static pages

function handler(error, result) {
  if (!error) {
    return result;
  }
}
//call to get the response from the bot.
async function runSample(message) {
  // A unique identifier for the given session

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: message,
        // The language used by the client (en-US)
        languageCode: "en-US"
      }
    }
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);

  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  return result;
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
}

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/" + "simpleuicopy.html");
});

app.use(express.static("."));
app.post("/send_message", urlencodedparser, function(req, res) {
  runSample(req.body.message).then(function func(data) {
    console.log(JSON.stringify({ message: data.fulfillmentText }));
    res.send(data.fulfillmentText);
  });
  //console.log("inside the send message:"+response.fulfillmentText);
});

app.get("/pop-up.html", function(req, res) {
  res.sendFile(__dirname + "/" + "pop-up.html");
});
//get request to process_post
app.get("/process_post", function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      //res.json({"code" : 100, "status" : "Error in connection database"})
      return;
    }
    console.log("connected as id" + connection.threadId);
    connection.query(
      'insert into details(Name,Email,Phno) values("' +
        req.query.name +
        '","' +
        req.query.email_id +
        '","' +
        req.query.phone_no +
        '")',
      function(err, rows, fields) {
        connection.release();
        if (err) {
          throw err;
        } else {
          res.status(204).send();
        }
      }
    );
  });
});
//server listening at 5001
var server = app.listen(5001, function(req, res) {
  var host = server.address().address;
  var port = server.address().port;

  //console.log("server running at host %s and port %s",host,port)
});
