import React, { Component } from 'react';
import Form from './Form';
import Record from './Record';
import logo from './logo.svg';
import './App.css';

const io = require('socket.io-client')  
const socket = io.connect("http://localhost:8080");

var tone1 = new Audio('audio/tone1.mp3');
var tone2 = new Audio('audio/tone2.mp3');

var inst_1 = new Audio('audio/v_instruction_01.mp3');
var inst_2 = new Audio('audio/v_instruction_02.mp3');
var inst_3 = new Audio('audio/v_instruction_03.mp3');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recordings: [],
      form: true,
      behaviourOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      currentBehaviour: 0
    };
    this.submit        = this.submit.bind(this);
    this.renderNext    = this.renderNext.bind(this);
    this.doneRecording = this.doneRecording.bind(this);
    this.doRobotMotion = this.doRobotMotion.bind(this);
    this.nextBehaviour = this.nextBehaviour.bind(this);
  };

  // Called when the submit button is clicked on the Likert scale question
  submit(data) {
      this.state.form = false;
      socket.emit("data", data);
      console.log("rating complete");
      tone1.play();

      this.setState({
        recordings: this.state.recordings.concat([data]),
        form: false
      });

      this.promptVoiceover();
  };

  // Called after submit is clicked on Likert scale form
  promptVoiceover() {
    inst_2.play();
    
  };

  // Alert server to start behaviour display routine
  doRobotMotion(behaviour) {
    socket.emit("robot", behaviour);
  };

  // Called after the voice recording is done and the user clicks Finished.
  // This is the last thing in a trial, so we start the next one.
  doneRecording() {
      this.state.form = true;
      socket.emit("data", 'done recording');
      console.log("recording complete");
      tone1.play();
      
      this.setState({
        form: true,
      });

      this.startTrial();
  };

  startTrial() {
    inst_1.play();
    setTimeout(this.doRobotMotion(this.nextBehaviour()), 10000); 
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
      return (<Form submit={this.submit} />)  
    } else {
      return (<Record doneRecording={this.doneRecording} />)
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
