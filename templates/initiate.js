var headers = {
    'Authorization': 'Bearer 130750bc55a84ed5898c747c2cb87aea'
};

var options = {
    url: 'https://api.dialogflow.com/v1/query?v=20150910&e=Welcomet&timezone=Asia/Colombo&lang=en&sessionId=1234567890',
    headers: headers
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

request(options, callback);
