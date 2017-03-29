import React, { Component } from 'react';

class Introduction extends Component {

  render() {
    return (
      <div id="container">
        <h1 id="title"> Welcome to Cuddlebit study. </h1>
        <p id="instruction"> Press Start when you are ready.</p>
        <div id="inner_content">
          <button className="btn btn-primary" onClick={this.props.start}>Start</button>
        </div>
      </div>
    );
  }
}

export default Introduction;