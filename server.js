var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require("body-parser");
var five = require('johnny-five');
var behaviours = require('./behaviours.js');
var fs = require('fs');

//////////////////////////////////////////////////////////////////////
// Logging
var now = new Date();

var stream = fs.createWriteStream("./logs/logfile" + now.getTime() + '.txt');
stream.on('error', console.error);

function write(str) {
  stream.write(str + '\n\n');
}
function log(obj) {
  var now = new Date();
  var ret = {
    timestamp: now.getTime(), 
    data: obj
  }
  var str = JSON.stringify(ret);
  write(str);
}
// log({this:"is", 'complicated': 'no?', no:"it is", yes: [1,2,3,4]})
// log({this:"is", 'complicated': 'no?', no:"it is", yes: [1,2,3,4]})

//////////////////////////////////////////////////////////////////////


//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

server.listen(8080);

console.log("Started back end...")

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', function (req, res) {
//   res.sendfile(__dirname + '/index.html');
// });

// app.post('handle',function(request,response){
//   // var query1=request.body.var1;
//   // var query2=request.body.var2;
//   console.log(request);
// });

io.on('connection', function (socket) {
  console.log("You connected. Congrats.");
  // sendStarter();
  // socket.emit('news', { hello: 'world' });
  log('connected')
  socket.emit('init');

  socket.on('data', function (data) {
    console.log(data);
    log(data)
  });

  socket.on('start', function (data) {
    console.log(data);
    log(data)
  });
  
  socket.on('robot', function(behaviour) {
    doRobotMotion(behaviour); // stub
    log(behaviour)
  })

});

//////////////////////////////////////////////////////////////////////
// Motor 
// 
//////////////////////////////////////////////////////////////////////
var boardOptions = {
  repl: false,
}
var board = new five.Board(boardOptions);
var servo;
board.on("ready", function() {
  servo = new five.Servo(10);
  // start the render loop/timer for the robot
  start();
});

// The base behaviour to play constantly
var base_behaviour = behaviours.behaviours[0];

// The test behaviour to mix in 
var mix_behaviour  = behaviours.behaviours[0];

var easeIn  = false;
var easeOut = false;
var play = false;

// Max number of frames before reset to zero
var maxframe = 1500;//
// Initialize the frame count
var frame = 0;
// Frames per second
var fps = 75;

// Called when the server starts
function start() {
  setInterval(function(){
    doMotor();
  }, Math.round(1000 / fps));
};

// send the motor the next position value
function doMotor() {
  tick();
  var pos = getPosition(frame);
  // if (pos % 5 === 0) {
  //   servo.to(50);
  //   console.log(50)
  // } else {
  //   servo.to(90);
  //   console.log(90)
  // }
  if ((pos >= 0) && (pos <= 90)) {
    servo.to(pos);
    console.log(pos);
  }
}

// Tick the clock, mod to maxframe
function tick() {
  frame = frame + 1;
  if (frame > maxframe) {
    frame = 0;
  }
}

// Return position for this frame
function getPosition(f) {
  var w = getWeight(f);
  var pos = ( w * base_behaviour[f]) + ((1.0 - w) * mix_behaviour[f]);
  // var pos = ( mix_behaviour[f]);
  return pos;
}

// Weighting function
function getWeight(f) {
  if (easeIn) {
    // console.log('playing weird behaviour')
    return (0.5 - (f / maxframe));
  }
  else if (play) {
    return 0.0
  }
  else if (easeOut) {
    // console.log('playing weird behaviour');
    return (f / maxframe);
  }
  else {
    return 1.0;
  }
};

// set a timeout to change the behaviour
// b : index of behaviour to mix in
function doRobotMotion(b) {
  console.log(b);

  var r =  (3 * 1000);
  mix_behaviour = behaviours.behaviours[b];


    frame = 0;
    // mix = true;
    easeIn = true;
    easeOut = false;
    play = false;

  setTimeout(function(){
    easeIn = false;
    easeOut = false;
    play = true
  }, r );


  setTimeout(function(){
    frame = 0;
    // mix = true;
    easeIn = false;
    easeOut = true;
    play = false;
  }, r + (17 * 1000));


  setTimeout(function(){
    frame = 0;
    mix = true;
    easeIn = false;
    easeOut = false;
  }, r + (19 * 1000));
  // setTimeout(function(){
  //   mix = true;
  // }, r);

  // setTimeout(function(){
  //   mix = false;
  // }, r + (30 * 1000));
  
  // // start mixing in the behaviour in r seconds, 0 < r < 30 seconds
  // setTimeout(function(){
  //   // make sure mixing starts from 0
  //   frame = 0;
  //   mix_behaviour = behaviours[b];
  // }, r);

  // // 
  // setTimeout(function(){
  //   // max sure mixing 
  //   frame = Math.round(maxframe / 2);
  //   mix_behaviour = behaviours[0];
  // }, r);

}

