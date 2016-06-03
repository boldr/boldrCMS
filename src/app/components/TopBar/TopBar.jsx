import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as boldrActions from 'app/state/boldr/boldr.actions';
import { browserHistory } from 'react-router';
import SiteLogo from '../SiteLogo';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickLogin = this.handleClickLogin.bind(this);
    this.handleClickRegister = this.handleClickRegister.bind(this);
  }

  handleClickLogin(event) {
    const path = '/login';
    browserHistory.push(path);
  }

  handleClickRegister(event) {
    const path = '/register';
    browserHistory.push(path);
  }
  handleHome() {
    const path = '/';
    browserHistory.push(path);
  }
  render() {
    return (
      <div className="topbar">
        <div className="topbar__content">
            { /* @ToDo Build logic for this on the server */ }
            { /* It should be like /api/v1/boldr/settings */ }
          <AppBar title={ <SiteLogo SiteLogoOrTitle="Boldr" /> }
            zDepth={ 2 }
            onTitleTouchTap={ ::this.handleHome }
            onLeftIconButtonTouchTap={ this.props.handleToggle }
            iconElementRight={
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={ { horizontal: 'right', vertical: 'top' } }
                anchorOrigin={ { horizontal: 'right', vertical: 'top' } }
              >
              {
                this.props.user.isAuthenticated ?
                  <MenuItem primaryText="Sign out" /> :
                  <div>
                    <MenuItem onTouchTap={ this.handleClickRegister } primaryText="Register" />
                    <MenuItem onTouchTap={ this.handleClickLogin } primaryText="Login" />
                  </div>
              }
              </IconMenu>
            }
          />
        </div>
      </div>
    );
  }
}

TopBar.propTypes = {
  dispatch: React.PropTypes.func,
  handleToggle: React.PropTypes.func,
  user: React.PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    boldr: state.boldr,
    user: state.user
  };
};

export default connect(mapStateToProps, null)(TopBar);