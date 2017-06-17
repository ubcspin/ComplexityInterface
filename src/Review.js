import ReactTable from 'react-table';
import 'react-table/react-table.css';
import React, { Component } from 'react';

class Review extends Component {

  render() {
    const data = this.props.data;

    const columns = [{
          Header: 'Behaviour Hash',
          accessor: 'hash' // String-based value accessors!
        }, {
          Header: 'Rating',
          accessor: 'rating',
        }, {
          Header: 'Replay Behaviour',
          accessor: 'replay'
        }]



    return (
        <div id="container" >

          <h1 id="title">Review:</h1>
          <ReactTable
              data={data}
              columns={columns}
          />
        </div>
    );
  }
}

export default Review;