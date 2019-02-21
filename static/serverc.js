var express = require("express");
var mysql = require("mysql");
const dialogflow = require("dialogflow");
const uuid = require("uuid");
require("dotenv").config();
var bodyparser = require("body-parser");
var process = require("process");

var pool = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "rohit",
  password: "rohit@903",
  database: "chatLog"
});

//connection.connect()

var app = express();
var urlencodedparser = bodyparser.urlencoded({ extended: false });
var chat_id = 1;

const sessionId = uuid.v4();
//console.log("loaded the uuuid package");

// Create a new session
const sessionClient = new dialogflow.SessionsClient();
//console.log("session client created");
const sessionPath = sessionClient.sessionPath("global-bot", sessionId);
//console.log("session path is created");
//used for rendering chatui page and static pages

function handler(error, result) {
  if (!error) {
    return result;
  }
}

//async function for chat_id generation and updating for global variable
function chat_Id() {
  //console.log("entered chat_id");
  return new Promise((resolve, request) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        //   console.log("error occured");
        return;
      }
      console.log("connected as id inside chat_id" + connection.threadId);

      //console.log("just before connection query");

      connection.query("insert into chat values();", function(err, results) {
        if (err) {
          throw err;
        } else {
          //s = 1
          chat_id = results.insertId;
          //console.log("row id:" + chat_id);
          resolve();
          //return results;
        }
      });

      //console.log("after chat_id insert query");
    });
  });
}

//asyn function for logging the chats
function chatlogs(req, res, urlencodedparser) {
  return new Promise((resolve, request) => {
    pool.getConnection(function(err, connection) {
      //console.log("entered chatlog");
      if (err) {
        connection.release();
        return;
      }

      //console.log("connected as id inside chat_log:" + connection.threadId);
      //console.log("text message:" + req.body.message);
      //console.log("chat_id----: " + chat_id);
      //console.log("before the chat line query");
      connection.query(
        'insert into chat_line(chat_id,line_text) values("' +
          chat_id +
          '","' +
          req.body.message +
          '")',
        function(err, rows, fields) {
          connection.release();
          if (err) {
            throw err;
          } else {
            resolve();
            //console.log("query done");
          }
        }
      );
      //console.log("after the chatline query");
    });
  });
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
  //console.log(`  Query: ${result.queryText}`);
  //console.log(`  Response: ${result.fulfillmentText}`);
  return result;
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
}

//serving the first page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/" + "simpleuicopy.html");
});

app.use(express.static("."));

//getting the response from the dialogflow agent for the given query
app.post("/send_message", urlencodedparser, function(req, res) {
  try {
    runSample(req.body.message).then(function func(data) {
      //console.log(JSON.stringify({ message: data.fulfillmentText }));
      res.send(data.fulfillmentText);
    });
  } catch (e) {
    //console.log(e);
  }
  //console.log("inside the send message:"+response.fulfillmentText);
});

//console.log("chat_id:" + chat_id);

//request for logging the chats using post request
app.post("/chatlog", urlencodedparser, async function(req, res) {
  try {
    chatlogs(req, res, urlencodedparser);
  } catch (e) {
    //console.log(e);
  }
  res.status(204).send();
});

//one time request for generating id and inserting message

app.post("/chat", urlencodedparser, async function(req, res) {
  console.log("entered inside new post request");
  try {
    await chat_Id();
    await chatlogs(req, res, urlencodedparser);
  } catch (e) {
    //console.log(e);
  }
});

//get request to process_post

app.post("/process_post", urlencodedparser, function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      //res.json({"code" : 100, "status" : "Error in connection database"})
      return;
    }
    console.log("connected as id" + connection.threadId);
    console.log(
      "chat_id:" +
        chat_id +
        "email_id:" +
        req.body.email_id +
        "name:" +
        req.body.name +
        "phone:" +
        req.body.phone_no
    );
    connection.query(
      'insert into details(chat_id,Email,name,ph_no) values("' +
        chat_id +
        '","' +
        req.body.email_id +
        '","' +
        req.body.name +
        '","' +
        req.body.phone_no +
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
