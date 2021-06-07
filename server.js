const express = require("express");
const cors = require("cors"); //it creates a new express app - middleware

const app = express();

app.use(cors());
app.use(express.json()); //any req that comes with the json body will be available inside the req object

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//  LEVEL 1
//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/messages", function (req, res) {
  res.send(messages);
});

//Level 3
//finds and returns messages containing the search term from query params
app.get("/messages/search", function (req, res) {
  //get search term from query params
  const searchTerm = req.query.text.toLowerCase();
  //find messages containing that term
  const results = messages.filter((m) =>
    m.text.toLowerCase().includes(searchTerm)
  );

  //return
  res.send(results);
});

//returns the most recent 10 messages
app.get("/messages/latest", function (req, res) {
  //let the last 10 messages
  const results = messages.slice(-10);
  //return them
  res.send(results);
});

//1/2 Creating a new message & read all the messages
//Adds a new message to the data store
app.post("/messages", function (req, res) {
  //get the message content from the req
  const message = {
    from: req.body,
    text: req.body.text,
  };

  //Level 2
  //if message is invalid, return status 404
  if (!isAValidMessage(message)) {
    res.status(400).send();
    return;
  }

  //assign it a new id
  message.id = getNextId();
  //add it to the data store array
  messages.push(message);
  //return a 201 status code and the message content
  res.status(201).send(message);
});

//func that calculates the next ID in the sequence and returns it
function getNextId() {
  //get the highest id in the datastore
  const lastMessage = messages[messages.length - 1];
  //add 1 to it and return
  return lastMessage ? lastMessage.id + 1 : 0;
}

//3. Read one message specified by an ID, if it exists
//otherwise return 404 status code
app.get("/messages/:id", function (req, res) {
  // get the message id from the req object
  const id = req.params.id;
  //find an existing message with that id
  const message = messages.find((m) => m.id == id);
  //if not return status code - 404
  if (!message) {
    res.status(404).send();
    return;
  }
  //otherwise return message object
  res.send(message);
});

//4. Delete a message by id
app.delete("/messages/:id", function (req, res) {
  //find the index of the message with the specified id
  const id = req.params.id;
  //if that message is not found, return 404
  const index = messages.findIndex((m) => m.id == id);
  if (index == -1) {
    res.status(404).send();
    return;
  }
  //otherwise remove the object at that index from the datastore
  messages.splice(index, 1);
  //return status 204
  res.status(204).send();
});

//LEVEL 2
//takes a message obj as param
//if the form or text properties are missing/empty -> return false
//otherwise return true
function isAValidMessage(message) {
  if (message.text && message.from) {
    //text and from are params of the object -> Postman
    return true;
  }
  return false;
}

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
