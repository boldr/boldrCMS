/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export type Props = {
  onClick: Function,
  children: ?ReactChildren,
  value: ?string,
  className: ?string,
  activeClassName: ?string,
  active: ?boolean,
  disabled: ?boolean,
  title: ?string,
};
export default class Option extends Component {
  props: Props;
  onClick: Function = () => {
    const { disabled, onClick, value } = this.props;
    if (!disabled) {
      onClick(value);
    }
  };

  render() {
    const { children, className, activeClassName, active, disabled, title } = this.props;
    return (
      <div
        className={classNames('boldr-editor__option-wrapper', className, {
          [`boldr-editor__option-active ${activeClassName}`]: active,
          'boldr-editor__option-disabled': disabled,
        })}
        onClick={this.onClick}
        aria-selected={active}
        title={title}
      >
        {children}
      </div>
    );
  }
}