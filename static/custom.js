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

    if (temp == 0) {
      $(".chat-message col-md-5 offset-md-7 bot-message").remove();
      temp = 1;
    }
    count++;

    $(".chat-container").append(`
                <div class="chat-message col-md-5 offset-md-7 bot-message">
                    ${data.message}
                </div>
          `);
    if (count == 2) {
      $(".chat-container").append(`
                <div class="chat-message col-md-5 offset-md-7 bot-message">
                    <html>
			<head>
				<title>simple form</title>
			</head>
		<body>
		<form method="GET" action= "http://127.0.0.1:5001/process_post">
		 name:<input type = "text" name ="name" >
		Email-ID:<input type = "Email" name ="email_id" >
		Ph.No:<input type = "number" name = "phone_no">
		<input type = "submit" name = "submit">
		</body>
		</html>

                </div>
          `);
    }
    // remove the loading indicator
    $("#loading").remove();
  }
}
//printing the input messages on the chat UI
$("#target").on("submit", function(e) {
  e.preventDefault();
  const input_message = $("#input_message").val();
  // return if the user does not enter any text
  if (!input_message) {
    return;
  }

  $(".chat-container").append(`
            <div class="chat-message col-md-5 human-message">
                ${input_message}
            </div>
        `);

  // loading
  $(".chat-container").append(`
            <div class="chat-message text-center col-md-2 offset-md-10 bot-message" id="loading">
		<b>...</b>
		</div>
        `);

  // clear the text input
  $("#input_message").val("");

  // send the message
  submit_message(input_message);
});
