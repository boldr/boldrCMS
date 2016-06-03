import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { authRegister } from 'app/state/auth/auth.actions';
import RegisterForm from './RegisterForm';

class Register extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { dispatch } = this.props;
    dispatch(authRegister(values));
  }
  render() {
    return (
      <RegisterForm onSubmit={ this.handleSubmit } />
    );
  }
}

Register.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default Register;