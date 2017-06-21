import ReactTable from 'react-table';
import 'react-table/react-table.css';
import React, { Component } from 'react';

class Review extends Component {

  render() {
    const data = this.props.data;

    var table = data.map(function(d) {
      var hash = d['hash'];
      var rating = d['rating'];
      return (
        <div>
        <div className="rev_row" key={Math.abs(hash * 13 * rating)}>
          <div className="rev_col">{hash}</div>
          <div className="rev_col">{rating}</div>
          {/*<div className="rev_col button" onClick={ () => this.props.socket.emit("robot", d['hash']) }>*/}
          <div className="rev_col button" onClick={ () => this.props.playBehaviour(d['hash']) }>
            replay {hash}
          </div>
        </div>
        <hr />
        </div>
      )
    }.bind(this));

    // const columns = [{
    //       Header: 'Behaviour Hash',
    //       accessor: 'hash' // String-based value accessors!
    //     }, {
    //       Header: 'Rating',
    //       accessor: 'rating',
    //     }, {
    //       Header: 'Replay Behaviour',
    //       accessor: 'replay'
    //     }]



    return (
        <div id="container" >
          <h1 id="title">Review</h1>
          <hr />
          <div className="rev_row">
            <div className="rev_col">Behaviour</div>
            <div className="rev_col">Rating</div>
            <div className="rev_col">Replay</div>
          </div>
          <hr />
          
          {table}
        </div>
    );
  }
}

export default Review;