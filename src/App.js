import React, { Component } from 'react';
import Form from './Form';
import Record from './Record';
import Transition from './Transition';
import Introduction from './Introduction';
import logo from './logo.svg';
import './App.css';

const io = require('socket.io-client')  
const socket = io.connect("http://localhost:8080");




socket.on('init', function() {
  socket.emit('start', 'start');
});

var inst_1 = new Audio('audio/instruction01.mp3');
var inst_2 = new Audio('audio/instruction02.mp3');
var inst_3 = new Audio('audio/instruction03.mp3');


class App extends Component {

  constructor(props) {
    super(props);

    var obj = {
      recordings: [],
      form: false,
      transition: false,
      introduction: true,
      behaviourOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      currentBehaviour: 1,
      socket: socket
    }
    
    this.state = obj;

    this.submit        = this.submit.bind(this);
    this.renderNext    = this.renderNext.bind(this);
    this.doneRecording = this.doneRecording.bind(this);
    this.nextBehaviour = this.nextBehaviour.bind(this);
    this.start         = this.start.bind(this);
    this.replay        = this.replay.bind(this);

    // this.doRobotMotion = this.doRobotMotion.bind(this); -- delete???
    // this.displayForm = this.displayForm.bind(this);

  };

  // Called when start button is pressed
  start() {

    console.log("study starts");

    this.setState({
      introduction: false,
      transition: true,
    });

    console.log(this.state.currentBehaviour);




    var send_0 = {
      'recordings': this.state.recordings,
      'form': this.state.form,
      'transition': this.state.transition,
      'introduction': this.state.introduction,
      'behaviourOrder': this.state.behaviourOrder,
      'currentBehaviour': this.state.currentBehaviour
    }
    var send = JSON.stringify(send_0)
    
    this.state.socket.emit("start", send);

    this.nextBehaviour();

    this.startTrial(this.state.currentBehaviour); // stub for value

  };


  // Called when the submit button is clicked on the Likert scale question
  submit(data) {
      this.state.socket.emit("data", data);
      console.log("rating complete");
      inst_1.pause();
      inst_1.currentTime = 0;

      this.setState({
        recordings: this.state.recordings.concat([data]),
        form: false,
        transition: false
      });

      this.promptVoiceover();
  };

  replay() {
    console.log(this.state.currentBehaviour - 1);
    // Alert server to start behaviour display routine
    socket.emit("robot", this.state.currentBehaviour - 1);
  }

  // Called after submit is clicked on Likert scale form
  promptVoiceover() {
    inst_2.play();
    
  };



  // Called after the voice recording is done and the user clicks Finished.
  // This is the last thing in a trial, so we start the next one.
  doneRecording() {

      this.state.socket.emit("data", 'done recording');
      console.log("recording complete");
      
      this.setState({
        form: false,
        transition: true,
      });

    this.nextBehaviour();
    this.startTrial();
  };

  startTrial() {

    // setTimeout(this.doRobotMotion(this.nextBehaviour()).bind(this), 10000);

    console.log(this.state.currentBehaviour);
    setTimeout(function() {
      // Alert server to start behaviour display routine




      this.state.socket.emit("robot", behaviour);

    }.bind(this), 2000);

    //Display form
    setTimeout(function(){
      inst_1.play();
      this.setState({
        transition: false,
        form: true
      });
      console.log('displaying form');
    }.bind(this), 15000);

  };

  // Returns the next behaviour on the play list and mutates state
  // such that the next behaviour is lined up
  nextBehaviour() {
    var behaviours = this.state.behaviourOrder;   // array of int
    var current    = this.state.currentBehaviour; // int
    var current_i  = behaviours.indexOf(current); // int 
    if (behaviours.length > current_i) {
      current = behaviours[current_i + 1];
      this.setState({currentBehaviour: current});

      return current
    }
    return current; // should only run if the array runs out...
  };

  renderNext() {
    if (this.state.form === true) {
      return (<Form submit={this.submit} replay={this.replay} />)
    } else if (this.state.transition === true){
      return (<Transition />)
    } else if (this.state.introduction === true) {
      return (<Introduction start={this.start} />)
    } else {
      return (<Record doneRecording={this.doneRecording} replay={this.replay} />)
    }   
  };

  render() {
    return (
      <div className="App">
        {this.renderNext()}
      </div>
    );
  };
}

export default App;
