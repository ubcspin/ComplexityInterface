import React, { Component } from 'react';

class Record extends Component {

  render() {
    return (
      <div id="container">
        <h1 id="title">Please <em>describe</em> the robot's behaviour.</h1>
        <p id="instruction">After the tone, please describe the robot's behaviour in a few short sentences.</p>
        <div id="inner_content">
          <button className="btn btn-primary" onClick={this.props.doneRecording}>Finished</button>
          &nbsp;&nbsp;&nbsp;
          <button className="btn btn-primary" onClick={this.props.replay}>Replay</button>
        </div>
      </div>
    );
  }
}

export default Record;