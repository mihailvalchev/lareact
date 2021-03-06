import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Main from './Router';
import {BrowserRouter, Route} from 'react-router-dom';
import 'bootstrap';

class Index extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route component={Main} />
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<Index/>, document.getElementById('app'));
