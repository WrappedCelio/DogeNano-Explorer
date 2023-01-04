// wss = ws://152.228.162.18:7089

const WS = require('ws');
const ReconnectingWebSocket = require('reconnecting-websocket');
const express = require("express")
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
const xdg = require("superagent");

// Variables d'environnement
const host = process.env.host;


app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get("/upload/cover.gif", function(req,res){
  res.sendFile(__dirname+"/files/cover.gif")
});

app.get("/upload/index.gif", function(req,res){
  res.sendFile(__dirname+"/files/sky.gif")
})

const ws = new ReconnectingWebSocket('wss://ws.dogenano.io', [], {
	WebSocket: WS,
	connectionTimeout: 1000,	
	maxRetries: 100000,
	maxReconnectionDelay: 2000,
	minReconnectionDelay: 10 
});

app.use(express.urlencoded({extended: true})); 

ws.onopen = () => {
	const confirmation_subscription = {
		"action": "subscribe", 
		"topic": "confirmation"
	}
	ws.send(JSON.stringify(confirmation_subscription));
};

ws.onmessage = msg => {
	console.log(msg.data);
	data_json = JSON.parse(msg.data);

	if (data_json.topic === "confirmation") {
		console.log ('Confirmed', data_json.message.block.subtype)
    io.emit('message', msg.data);

	}
};

app.post("/info", function(req,res){

  if (req.body.q.startsWith("xdg_")){
    res.redirect(host + "/account/?id="+req.body.q)
  }
  if (!req.body.q.startsWith("xdg_")) {
    res.redirect(host + "/hash/?id="+req.body.q)
  }
});

app.get("/hash/", function(req,res){
   res.sendFile(__dirname+"/public/hash.html");
});

app.get("/account/", function(req,res){
   res.sendFile(__dirname+"/public/account.html");
});




app.get("/upload/happy.png", function(req,res){
 res.sendFile(__dirname+"/files/happy.png")
});

http.listen(3000, function(){
  console.log('listening on *:' + 3000);
});

