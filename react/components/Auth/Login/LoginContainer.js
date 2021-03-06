import React, {Component} from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      error: '',
      formSubmitting: false,
      user: {
        email: '',
        password: '',
      },
      redirect: props.redirect,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }
  componentWillMount() {
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      this.setState({isLogged: AppState.isLogged, user: AppState});
    }
  }
  componentDidMount() {
    const { prevLocation } = this.state.redirect.state || { prevLocation: { pathname: '/dashboard' } };
    if (prevLocation && this.state.isLogged) {
      return this.props.history.push(prevLocation);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({formSubmitting: true});
    let userData = this.state.user;
    axios.post("/login", userData).then(response => {
      return response;
    })
    .then(res => {
        if (res.status==200) {
           let userData = {
             id: res.data.user.id,
             name: res.data.user.name,
             email: res.data.user.email,
           };
           let appState = {
             isLogged: true,
             user: userData,
             token: res.data.token
           };

           axios.defaults.headers.common = {'Authorization': `Bearer ${` +res.data.token+ `}`}
           localStorage["appState"] = JSON.stringify(appState);
           this.setState({
              isLogged: appState.isLogged,
              user: appState.user,
              error: ''
           });
           toast.success('Success! Logging you in...', { autoClose: 1600 });
            setTimeout(() => {
               location.reload()
            }, 1600);
        } else {
            toast.warning('Could not log you in. Please try again.');
        }
    })
    .catch(error => {
        this.setState({formSubmitting: false});
        toast.warning('Could not log you in. Please try again.');
     })
    .finally(this.setState({error: ''}));
}
handleEmail(e) {
  let value = e.target.value;
  this.setState(prevState => ({
    user: {
      ...prevState.user, email: value
    }
  }));
}
handlePassword(e) {
  let value = e.target.value;
  this.setState(prevState => ({
    user: {
      ...prevState.user, password: value
    }
  }));
}
render() {
  const { state = {} } = this.state.redirect;
  const { error } = state;
  return (
    <div className="container">
      <div className="row">
        <div className="offset-xl-3 col-xl-6 offset-lg-1 col-lg-10 col-md-12 col-sm-12 col-12 ">
          <h2 className="text-center mb30">Login To Your Account</h2>
          <br />
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <input id="email" type="email" name="email" placeholder="E-mail" className="form-control" required onChange={this.handleEmail}/>
            </div>
            <div className="form-group">
                <input id="password" type="password" name="password" placeholder="Password" className="form-control" required onChange={this.handlePassword}/>
            </div>
           <button disabled={this.state.formSubmitting} type="submit" name="singlebutton" className="btn btn-success btn-lg  btn-block mb10"> {this.state.formSubmitting ? "Logging You In..." : "Log In"} </button>
           </form>
            <br />
            <p className="text-white">Don't have an account? <Link to="/register"> Register</Link>
              <span className="pull-right">
                <Link to="/">Back to Index</Link>
              </span>
            </p>
        </div>
      </div>
    </div>
    )
  }
}
export default withRouter(LoginContainer);
