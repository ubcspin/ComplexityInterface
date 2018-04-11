import React, { Component } from 'react';
import Form from './Form';
import Record from './Record';
import Transition from './Transition';
import Introduction from './Introduction';
import Review from './Review';
import logo from './logo.svg';
import './App.css';


const io = require('socket.io-client')  
const socket = io.connect("http://localhost:8080");

socket.on('init', function() {
  socket.emit('start', 'start');
});

var inst_1 = new Audio('audio/instruction01.mp3');
var inst_2 = new Audio('audio/instruction02.mp3');
var tone   = new Audio('audio/tone2.mp3');


class App extends Component {

  constructor(props) {
    super(props);

    var obj = {

      //work flow
      recordings: [],
      form: false,
      transition: false,
      introduction: true,
      review: false,

      //behaviours
      behaviourOrder: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      // for testing:
      // behaviourOrder: [0,1,2,3],
      currentBehaviour: 0, //the first behaviour is ignored purposely

      trial: 0,
      socket: socket,
      skip: false,
      data: [], //review behaviour table data
      spin: false
    }
    
    this.state = obj;

    this.submit        = this.submit.bind(this);
    this.renderNext    = this.renderNext.bind(this);
    this.doneRecording = this.doneRecording.bind(this);
    this.nextBehaviour = this.nextBehaviour.bind(this);
    this.start         = this.start.bind(this);
    this.replay        = this.replay.bind(this);
    this.togInst       = this.togInst.bind(this);
    this.spinner       = this.spinner.bind(this);
    this.playBehaviour = this.playBehaviour.bind(this);

    // this.doRobotMotion = this.doRobotMotion.bind(this); -- delete???
    // this.displayForm = this.displayForm.bind(this);

  };


  // Called when start button is pressed
  start() {

    //randomize behaviour order:
    var order = [0,19,20];
    var temp = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

    while(temp.length > 0){
      var rand = Math.floor(Math.random() * temp.length) + 0;
      order.push(temp[rand]);
      temp.splice(rand, 1);

      console.log(temp.length);
    }

    this.setState({ behaviourOrder: order}, function () {
      console.log(this.state.behaviourOrder);
      console.log("study starts");
      console.log(this.state.currentBehaviour);

      var send_0 = {
        'recordings': this.state.recordings,
        'form': this.state.form,
        'transition': this.state.transition,
        'introduction': this.state.introduction,
        'behaviourOrder': this.state.behaviourOrder,
        'currentBehaviour': this.state.currentBehaviour,
        'review': this.state.review
      }

      var send = JSON.stringify(send_0)
      this.state.socket.emit("start", send);

      this.nextBehaviour();
    });

  };


  // Called when the submit button is clicked on the Likert scale question
  submit(data) {
      this.state.socket.emit("data", data);

      //---review behaviour table data---
      var newData = {
        hash: this.state.currentBehaviour,
        rating: data.selectedOption,
        replay: "--"
      }
      var data = this.state.data;
      data.push(newData);
      this.setState({
        data: data
      })
      //----------------------------------

      console.log("rating complete");

      this.setState({
        recordings: this.state.recordings.concat([data]),
        form: false,
        transition: false
      });

      this.promptVoiceover();
  };

  replay() {
    console.log(this.state.currentBehaviour );
    // Alert server to start behaviour display routine
    this.playBehaviour(this.state.currentBehaviour);
  };

  // Called after submit is clicked on Likert scale form
  promptVoiceover() {
    inst_1.pause();
    inst_1.currentTime = 0;

    if (this.state.skip) {
      tone.play();
    } else {
      inst_2.play();
    }
  };

  // Called after the voice recording is done and the user clicks Finished.
  // This is the last thing in a trial, so we start the next one.
  doneRecording() {
    inst_2.pause();
    inst_2.currentTime = 0;

    this.state.socket.emit("data", 'done recording');
    console.log("recording complete");

    this.nextBehaviour();
  };

  startTrial() {

    // setTimeout(this.doRobotMotion(this.nextBehaviour()).bind(this), 10000);
    console.log('displaying form');
    console.log(this.state.currentBehaviour);

    //start behaviour display routine
    setTimeout(function(){
      this.playBehaviour(this.state.currentBehaviour);
    }.bind(this), 850);

    //Display form
    setTimeout(function(){

      if (!this.state.skip){
        inst_1.play();
      }

      this.setState({
        transition: false,
        form: true
      });

    // }.bind(this), 20); // CHANGE BACK TO 20000 #PAUL !!!
  }.bind(this), 23000);

  };

  // Starts the next behaviour on the play list and mutates state
  // such that the next behaviour is lined up
  nextBehaviour() {
    var behaviours = this.state.behaviourOrder;   // array of int
    var current    = this.state.currentBehaviour; // int
    var current_i  = behaviours.indexOf(current); // int
    var current_trial      = this.state.trial;

    console.log('current i = ' + current_i);
    console.log('current behaviour = ' + current);
    if (behaviours.length > current_i + 1) {

      // start next behaviour trial
      current = behaviours[current_i + 1];
      this.setState({
        currentBehaviour: current,
        introduction: false,
        form: false,
        transition: true,
        trial: current_trial + 1
      });
      this.startTrial();
      return current;
    }

    // jump to review behaviour table
    this.setState({
      introduction: false,
      form: false,
      review: true,
      trial: ' '
    });
    return current; // should only run if the array runs out...
  };

  //Toggle skip-instruction checkbox
  togInst(event) {
    const target = event.target;
    const value = target.checked;
    this.setState({ skip : value });

    inst_1.pause();
    inst_1.currentTime = 0;

  };

  renderNext() {
    if (this.state.form === true) {
      return (<Form submit={this.submit} replay={this.replay}  />)
    } else if (this.state.transition === true){
      return (<Transition />)
    } else if (this.state.introduction === true) {
      return (<Introduction start={this.start} />)
    } else if (this.state.review === true) {
      return (
        <Review 
           data={this.state.data} 
           socket={this.state.socket}
           playBehaviour={this.playBehaviour}
        />)
    } else {
        return (<Record doneRecording={this.doneRecording} replay={this.replay} />)
      }
  };

  playBehaviour(b) {

    socket.emit("robot", b );
    this.setState({
      spin: true
    });

    setTimeout(function () {
      this.setState({
        spin: false
      });

    }.bind(this), 22150);
  }

  spinner() {
    if (this.state.spin) {
      return <div className="loader"></div>
    }
    return;
  }

  render() {
    return (

      <div className="App" >

        <div className="skip-inst" style={{float: 'right', padding: '30px'}}>
          <label className="skip-inst-label">
            <input onClick={this.togInst} className="skip-inst-input" type="checkbox"  checked={this.state.skip} />
            <span className='instruct-label'>Mute Voice Instruction</span>
          </label> </div>
        <p id="trial" style={{position: 'relative', float: 'left', padding: '30px', left: '46%'}}> Trial: {this.state.trial}/20 </p>
        <p id="hash" style={{position: 'absolute', color:'grey', padding: '30px', bottom:'0px', fontSize: '32'}}> B{this.state.currentBehaviour}</p>
        {this.spinner()}
        {this.renderNext()}

      </div>
    );
  };
}

export default App;
