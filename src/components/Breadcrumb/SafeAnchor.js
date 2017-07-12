/* @flow */
import React, { PureComponent } from 'react';

function isTrivialHref(href) {
  return !href || href.trim() === '#';
}
export type Props = {
  href?: string,
  onClick?: Function,
  disabled?: boolean,
  role?: string,
  tabIndex?: string | number,
  componentClass?: any,
};
/**
 * There are situations due to browser quirks where
 * an anchor tag is needed, when semantically a button tag is the
 * better choice. SafeAnchor ensures that when an anchor is used like a
 * button its accessible. It also emulates input `disabled` behavior for
 * links, which is usually desirable for Buttons, NavItems, MenuItems, etc.
 */
class SafeAnchor extends PureComponent {
  static defaultProps = {
    componentClass: 'a',
  };
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { disabled, href, onClick } = this.props;

    if (disabled || isTrivialHref(href)) {
      event.preventDefault();
    }

    if (disabled) {
      event.stopPropagation();
      return;
    }

    if (onClick) {
      onClick(event);
    }
  }
  props: Props;
  render() {
    const { componentClass: Component, disabled, ...props } = this.props;

    if (isTrivialHref(props.href)) {
      props.role = props.role || 'button';
      // we want to make sure there is a href attribute on the node
      // otherwise, the cursor incorrectly styled (except with role='button')
      props.href = props.href || '#';
    }

    if (disabled) {
      props.tabIndex = -1;
      props.style = { pointerEvents: 'none', ...props.style };
    }

    return <Component {...props} onClick={this.handleClick} />;
  }
}

export default SafeAnchor;
