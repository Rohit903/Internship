from flask import Flask,request,jsonify,render_template
import os
import dialogflow
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('simpleuicopy.html')

@app.route("/initiate")
def initiate():
    print("calling initiate.js")
    return render_template("initiate.js")

@app.route('/get_detail',methods = ['POST'])
def get_detail():
        print("entering get movie detail ==--==-=-=-=-=-=-=")
        data = request.get_json(silent=True)
        print(data)
        print("-------------------------------------------------------------------------------------------------------------------------")
        print("call from dialogflow to get the details")
        reply = {
                "fulfillmentText" : "let me decide", 
                "fulfillmentMessages": [{"text": {"text": ["not formal response"]}}]
                }       
                
        return jsonify(reply)

# dialogflow gets the input and finds the intent and sends the fulfillment text
def detect_intent_texts(project_id, session_id, text, language_code):
        print("Entering detect intent texts --==-=-=-==--")
        session_client = dialogflow.SessionsClient()
        session = session_client.session_path(project_id, session_id)

        if text:
            text_input = dialogflow.types.TextInput(text=text, language_code=language_code)
            query_input = dialogflow.types.QueryInput(text=text_input)

            response = session_client.detect_intent(
                session=session, query_input=query_input)
           # print(response)
            print("exiting detect intent texts--------")
            return response.query_result.fulfillment_text

# the above text will be submitted to below defined location.
@app.route('/send_message',methods = ['POST'])
def send_message():
        message = request.form['message']
        print(message)
        project_id = os.getenv('DIALOGFLOW_PROJECT_ID')
        fulfillment_text = detect_intent_texts(project_id, "unique", message, 'en')
        response_text = { "message":  fulfillment_text }
        print(response_text)
        return jsonify(response_text)

if __name__ == "__main__":
    app.run()
