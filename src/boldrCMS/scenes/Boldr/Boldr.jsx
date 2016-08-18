import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import Notifications from '../../components/atm.Notification';

const Boldr = (props) => {
  return (
    <div>
      <Helmet
        title="Boldr"
        titleTemplate={ '%s | powered by Boldr' }
      />

      { props.children }
      <Notifications />
    </div>
  );
};

Boldr.propTypes = {
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {
    boldr: state.boldr,
    auth: state.auth,
    notifications: state.notifications
  };
}

export default connect(mapStateToProps)(Boldr);