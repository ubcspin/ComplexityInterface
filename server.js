var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require("body-parser");
var five = require('johnny-five');

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

  socket.on('data', function (data) {
    console.log(data);
  });
  socket.on('robot', function(behaviour) {
    doRobotMotion(behaviour); // stub
  })
});


//////////////////////////////////////////////////////////////////////////////////////////
// Motor 
// 
//////////////////////////////////////////////////////////////////////////////////////////
var boardOptions = {
  repl: false,
}
var board = new five.Board(boardOptions);
var servo;
board.on("ready", function() {
  servo = new five.Servo(10);

  // Servo alternate constructor with options
  /*
  var servo = new five.Servo({
    id: "MyServo",     // User defined id
    pin: 10,           // Which pin is it attached to?
    type: "standard",  // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0,180],    // Default: 0-180
    fps: 100,          // Used to calculate rate of movement between positions
    invert: false,     // Invert all specified positions
    startAt: 90,       // Immediately move to a degree
    center: true,      // overrides startAt if true and moves the servo to the center of the range
  });
  */

  // Add servo to REPL (optional)
  // this.repl.inject({
  //   servo: servo
  // });


  // Servo API

  // min()
  //
  // set the servo to the minimum degrees
  // defaults to 0
  //
  // eg. servo.min();

  // max()
  //
  // set the servo to the maximum degrees
  // defaults to 180
  //
  // eg. servo.max();

  // center()
  //
  // centers the servo to 90°
  //
  // servo.center();

  // to( deg )
  //
  // Moves the servo to position by degrees
  //
  // servo.to( 90 );

  // step( deg )
  //
  // step all servos by deg
  //
  // eg. array.step( -20 );

  // servo.sweep();

  start()
});


var behaviour_00 = sineBehaviour();
var behaviour_01 = randomBehaviour();
var behaviour_02 = randomBehaviour();
var behaviour_03 = randomBehaviour();
var behaviour_04 = randomBehaviour();
var behaviour_05 = randomBehaviour();
var behaviour_06 = randomBehaviour();
var behaviour_07 = sineBehaviour();
var behaviour_08 = sineBehaviour();
var behaviour_09 = sineBehaviour();
var behaviour_10 = sineBehaviour();
var behaviour_11 = sineBehaviour();
var behaviour_12 = sineBehaviour();
var behaviour_13 = sineBehaviour();
var behaviour_14 = sineBehaviour();
var behaviour_15 = sineBehaviour();

var behaviours = [
  behaviour_00,
  behaviour_01,
  behaviour_02,
  behaviour_03,
  behaviour_04,
  behaviour_05,
  behaviour_06,
  behaviour_07,
  behaviour_08,
  behaviour_09,
  behaviour_10,
  behaviour_11,
  behaviour_12,
  behaviour_13,
  behaviour_14,
  behaviour_15,
]

// The base behaviour to play constantly
var base_behaviour = behaviour_00;

// The test behaviour to mix in 
var mix_behaviour  = behaviour_01;

var easeIn  = false;
var easeOut = false;

// Max number of frames before reset to zero
var maxframe = 240;
// Initialize the frame count
var frame = 0;
// Frames per second
var fps = 60;

// Called when the server starts
function start() {
  setInterval(function(){
    doMotor();
  }, Math.round(1000 / fps));
};

// send the motor the next position value
function doMotor() {
  tick();
  var pos = getPosition(frame)
  servo.to(pos);
  //console.log(pos);
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
  var pos = (w * base_behaviour[f]) + ((1.0 - w) * mix_behaviour[f])
  return pos;
}

// Weighting function
function getWeight(f) {
  if (easeIn) {
    console.log('playing weird behaviour');
    return (f / maxframe);
  } 
  else if (easeOut) {
    console.log('playing weird behaviour');
    return (1.0 - (f / maxframe));
  }
  else {
    return 1.0;
  }
};

// set a timeout to change the behaviour
// b : index of behaviour to mix in
function doRobotMotion(b) {
  console.log(b);
  var r = Math.random() * (15 * 1000);
  mix_behaviour = behaviours[b];
  setTimeout(function(){
    frame = 0;
    // mix = true;
    easeIn = true;
    easeOut = false;
  }, r);

  setTimeout(function(){
    frame = 0;
    // mix = true;
    easeIn = false;
    easeOut = true;
  }, r + (10 * 1000));


  setTimeout(function(){
    frame = 0;
    // mix = true;
    easeIn = false;
    easeOut = false;
  }, r + (12 * 1000));
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


////////////////////////////////////////////////////////////////////
// Behaviour generation functions
// 
////////////////////////////////////////////////////////////////////

// Generate a completely random behaviour
function randomBehaviour() {
  var out = []
  for (var i = 0; i<250; i++) {
    out.push(Math.random() * 180);
  }
  return out;
}

// Generate a behaviour based on sine wave
function sineBehaviour() {
  var out = [];
  var hz = 1/60;
  for (var i = 0; i<250; i++) {
    
    // get sine value
    var s = Math.sin(Math.PI * hz * i);

    // put in 0-180 range
    var sn = ((s + 1) / 2) * 180;

    out.push(Math.round(sn))
  }
  return out;
}


// var weightedSample = {
//   '1' : [0, 0.25],
//   '2' : [0.25, 1.0]
// }

// function aliasDistribution(d) {
//   var i = 1.0;

//   // Multiply 
//   for (e in d) {
//     i = i * ((d[e][1] -  * 100);
//   }
//   var arr = new Array(i);

//   for (var j = 0; j < arr.length; j++) {

//   }

// }