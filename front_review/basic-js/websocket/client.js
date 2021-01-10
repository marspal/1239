const ws = require('ws');

const wss = new ws("ws://localhost:3000");

wss.on("message", (message) => {
  console.log(message);
  if(message == 10){
    // ws.send("close");
    // ws.CLOSED()
    wss.send("close");
    wss.close();
  }
});

