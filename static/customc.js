/*$.ajax(
        url: 'https://api.wit.ai/message?v=20140826&q=',
        beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", "Bearer 130750bc55a84ed5898c747c2cb87aea")
        }, success: function(data){
            alert(data);
            
        }
})*/
var temp = 0;
var count = 0;
function submit_message(message) {
  $.post("/send_message", { message: message }, handle_response);

  function handle_response(data) {
    // append the bot repsonse to the div

    /*if (temp == 0) {
      $(".chat").remove();
      temp = 1;
    }*/
    count++;

    $(".chatlogs").append(`
          <div class="chat">
                <div class="bot-photo"></div>
                <div class = "chatbot"> ${data.message}
            </div>
          `);
    if (count == 2) {
      $(".chatlogs").append(`
                <div class="chat">
	      		<div class="bot-photo"></div>
	      		<div class = "chatbot">
                    <html>
			<head>
				<title>simple form</title>
			</head>
		<body>
		<form method="GET" action= "http://127.0.0.1:5001/process_post"><br>
		 name:<input type = "text" name ="name" ><br>
		Email-ID:<input type = "Email" name ="email_id" ><br>
		Ph.No:<input type = "number" name = "phone_no"><br>
		<input type = "submit" name = "submit">
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
$(document).ready(function(){

$("#target").on("click", function(e) {
  console.log("entered")
  e.preventDefault();
  const input_message = $("#input_message").val();
  // return if the user does not enter any text
  if (!input_message) {
    return;
  }

  $(".chatlogs").append(`
    <div class="chat">
        <div class="user-photo"></div>
            <div class = "chatuser"> 
                ${input_message}
            </div>
        </div>
        `);

  // loading
  $(".chatlogs").append(`
    
        <div class="chat" id = "loading">
            <div class="bot-photo"></div>
                <div class = "chatbot"> 
                    <b>...</b>
                </div>
		</div>
        `);

  // clear the text input
  $("#input_message").val("");

  // send thie message
  submit_message(input_message);
})
});
