const dialogflow = require("dialogflow");
const uuid = require("uuid");
console.log("modules loaded");

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
function runSample(projectId) {
  // A unique identifier for the given session
  const sessionId = uuid.v4();
  console.log("loaded the uuuid package");

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  console.log("session client created");
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  console.log("session path is created");

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: "hello",
        // The language used by the client (en-US)
        languageCode: "en-US"
      }
    }
  };

  // Send request and log result
  const responses = sessionClient.detectIntent(request);
  console.log("Detected intent");
  const result = responses[0]
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
}

function send_message() {
  runSample("global-bot");
}

send_message();
