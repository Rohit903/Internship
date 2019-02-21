var temp = 0;
var count = 0;
var flag = 0;
var c = 0;
function g() {
  c++;
  if (c > 1) return false;
  return true;
}

function validate() {
  var number = document.getElementById("nu").value;
  var len = number.toString().length;
  if (len < 10 || len > 10) {
    document.getElementById("nummes").innerHTML =
      "please enter the valid phone number";
    return false;
  } else {
    var name = document.getElementById("nm").value;
    var email = document.getElementById("em").value;
    var num = document.getElementById("nu").value;
    console.log("name:" + name + "email:" + email + "num:" + num);
    return g();
  }
}
function submit_message(message) {
  $.post("/send_message", { message: message }, handle_response);
  function handle_response(data) {
    // append the bot repsonse to the div
    count++;

    $(".chatlogs").append(`
          <div class="chat">
                <div class="bot-photo"><img src="bot.png"></div>
                <div class = "chatbot"> ${data}
            </div>
          `);
    $("chatlogs")
      .stop()
      .animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 1000);

    if (count == 1) {
      $(".chatlogs").append(`
      <div class="chat">
	    <div class="bot-photo"></div>
	    <div class = "chatbot">
      <html>
			<head>
				<title>simple form</title>
			</head>
      <body>
        <form id = "thank" method="POST" onsubmit=" return validate()" action = "/process_post">
        <h2>Please help us out with the Following Information</h2>
         Name :<input type = "text" id = "nm" name ="name" required autocomplete = off /><br>
         Email:<input type = "email" id = "em" name ="email_id" required  autocomplete = off/><br>
         <span id="emmes"></span>
         Ph.No:<input type = "number" id="nu" pattern ="[0-9]{10,10}" name = "phone_no" required autocomplete = off><br/>
         <span id="nummes"></span>
        <button type = "submit" id = "sub" value = "submit" >Send</button>
        </form>
		 </body>
		 </html>
		 </div>
     </div>
    `);
    }
    // remove the loading indicator

    $("#loading").remove();
  }
}
//printing the input messages on the chat UI
$(document).ready(function() {
  $("#target").on("submit", function(e) {
    //console.log("entered");
    e.preventDefault();
    const input_message = $("#input_message").val();
    //console.log("message received inside submit:" + input_message);
    if (flag == 0) {
      //console.log("entered inside flag==0");
      $.post("/chat", { message: input_message }, function(data, status) {
        console.log(data);
      });
      flag = 1;
    } else {
      console.log("inside chatlog");
      $.post("/chatlog", { message: input_message }, function(data, status) {});
    }

    // return if the user does not enter any text

    if (!input_message) {
      return;
    }

    $(".chatlogs").append(`
    <div class="chat">
        <div class="user-photo"><img src="user.png"></div>
            <div class = "chatuser"> 
                ${input_message}
            </div>
        </div>
        `);

    // loading
    $(".chatlogs").append(`
    
        <div class="chat" id = "loading">
            <div class="bot-photo"><img src="bot.png"></div>
                <div class = "chatbot"> 
                    <b>...</b>
                </div>
		</div>
        `);

    // clear the text input
    $("#input_message").val("");

    // send thie message
    submit_message(input_message);
    console.log("after submit message", $(".chatlogs")[0].scrollHeight);
    $(".chatlogs")
      .stop()
      .animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 1000);
  });
});
