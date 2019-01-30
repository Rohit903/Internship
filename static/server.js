var express = require("express")
var mysql = require("mysql")
var process = require("process")
var pool = mysql.createPool({
  connectionLimit : 1,
  host     : 'localhost',
  user     : 'rohit',
  password : 'rohit@903',
  database : 'db1'
});

//connection.connect()

var app = express()

app.use(express.static("static"))
flag = 0
//get request to process_post 
app.get('/process_post',function(req,res){
	pool.getConnection(function(err,connection){
		if(err)
		{
			connection.release();
			//res.json({"code" : 100, "status" : "Error in connection database"})
			return;
		}
		console.log('connected as id' + connection.threadId);

	
	console.log('insert into details(Name,Email,Phno) values(\"'+req.query.name+'\",\"'+req.query.email_id+'\",\"'+req.query.phone_no+"\")");

	connection.query('insert into details(Name,Email,Phno) values(\"'+req.query.name+'\",\"'+req.query.email_id+'\",\"'+req.query.phone_no+"\")", function (err, rows, fields) {
	connection.release();
  	if (err) 
	{
		throw err
	}

	})

	})

	console.log("the details received are name=%s and email_id = %s and phone_no = %s",req.query.name,req.query.first_name,req.query.second_name)

})
//server listening at 5001
var server = app.listen(5001,function(req,res){
	var host = server.address().address
	var port = server.address().port

	//console.log("server running at host %s and port %s",host,port)
})
