import React from 'react';
import { connect } from 'react-redux';
import TransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames/bind';

const cx = styles::classNames;

import styles from './style.css';

const getter = (obj, propName) => (obj.get ? obj.get(propName) : obj[propName]);

import Notification from './Notification';


function Notifications(props) {
  const { notifications, className, componentClassName, CustomComponent, transitionEnterTimeout, transitionLeaveTimeout, onActionClick, actionLabel } = props;

  const items = notifications.map((notification) => (
    <Notification
      key={ getter(notification, 'id') }
      id={ getter(notification, 'id') }
      message={ getter(notification, 'message') }
      kind={ getter(notification, 'kind') }
      componentClassName={ componentClassName }
      CustomComponent={ CustomComponent }
      onActionClick={ onActionClick }
      actionLabel={ actionLabel }
    />
  ));
  const classes = [
    `${componentClassName}__container`,
    className || null
  ].join(' ').split();

  return (
    <div className={ cx(classes) } >
      <TransitionGroup
        transitionName={ `${componentClassName}-transition` }
        transitionEnterTimeout={ transitionEnterTimeout }
        transitionLeaveTimeout={ transitionLeaveTimeout }
      >
        { items }
      </TransitionGroup>
    </div>
  );
}

Notifications.defaultProps = {
  className: null,
  componentClassName: 'notification',
  transitionEnterTimeout: 600,
  transitionLeaveTimeout: 600,
  onActionClick: null,
  action: null
};

Notifications.propTypes = {
  notifications: React.PropTypes.array,
  className: React.PropTypes.string,
  CustomComponent: React.PropTypes.func,
  componentClassName: React.PropTypes.string,
  transitionEnterTimeout: React.PropTypes.number,
  transitionLeaveTimeout: React.PropTypes.number,
  onActionClick: React.PropTypes.func,
  actionLabel: React.PropTypes.string
};

export default connect((state) => ({
  notifications: state.get ? state.get('notifications') : state.notifications
}), {})(Notifications);
