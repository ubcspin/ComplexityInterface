import React, { Component } from 'react';

var instruction;

class Form extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '-2',
    }
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.submit = this.submit.bind(this);
  };
  
  handleOptionChange (changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  };

  submit(data) {
    this.props.submit(data);
  };

  render() {

    return (
      <div id="container" >
        
      <h1 id="title">Please rate the robot's behaviour.</h1>
      <p id="instruction">Please indicate how <em>positive</em> or <em>negative</em> the robot's displayed behaviour seemed to you.</p>
      <div id="inner_content">
              <form id="form">
              <fieldset className="form-group">
              <legend> </legend>
                <div className="form-check">
                  <label className="form-check-label">             
                    <input onChange={this.handleOptionChange} className="form-check-input" type="radio" name="optionsRadios" id="optionsRadios_2" value="-2" defaultChecked={true} />
                    <span className='rating'>-2</span><span className='explanation'>(Very negative)</span>
                  </label>
                </div>
                <div className="form-check">
                  <label className="form-check-label">             
                    <input onChange={this.handleOptionChange} className="form-check-input" type="radio" name="optionsRadios" id="optionsRadios_1" value="-1" defaultChecked={false} />
                    <span className='rating'>-1</span><span className='explanation'>(Negative)</span>
                  </label>
                </div>
                <div className="form-check">
                  <label className="form-check-label">             
                    <input onChange={this.handleOptionChange} className="form-check-input" type="radio" name="optionsRadios" id="optionsRadios0" value="0" defaultChecked={false} />
                    <span className='rating'>0</span><span className='explanation'>(Neutral)</span>
                  </label>
                </div>
                <div className="form-check">
                  <label className="form-check-label">             
                    <input onChange={this.handleOptionChange} className="form-check-input" type="radio" name="optionsRadios" id="optionsRadios1" value="1" defaultChecked={false} />
                    <span className='rating'>1</span><span className='explanation'>(Positive)</span>
                  </label>
                </div>
                <div className="form-check">
                  <label className="form-check-label">             
                    <input onChange={this.handleOptionChange} className="form-check-input" type="radio" name="optionsRadios" id="optionsRadios2" value="2" defaultChecked={false} />
                    <span className='rating'>2</span><span className='explanation'>(Very Postive)</span>
                  </label>
                </div>
              </fieldset>
              </form>
              <button className="btn btn-primary" onClick={this.submit.bind(null, this.state)}>Submit</button>
              &nbsp;&nbsp;&nbsp;
              <button className="btn btn-primary" onClick={this.props.replay}>Replay</button>
            </div>
      </div>
    );
  }
}

export default Form;