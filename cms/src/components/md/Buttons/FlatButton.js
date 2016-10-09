import React, { PureComponent, PropTypes } from 'react';
import cn from 'classnames';

import Button from './Button';

/**
 * Any other props such as style or event listeners will also
 * be applied to the button.
 */
export default class FlatButton extends PureComponent {
  static propTypes = {
    /**
     * The label to display in the button.
     */
    label: PropTypes.any,

    /**
     * An optional className to apply to the button.
     */
    className: PropTypes.string,

    /**
     * Boolean if the icon should be displayed before the label.
     */
    iconBefore: PropTypes.bool,

    /**
     * A `FontIcon` to display in the button. It can be placed before
     * or after the label.
     */
    children: PropTypes.node,

    /**
     * The button type.
     */
    type: PropTypes.string,

    /**
     * Boolean if the button should be styled with the primary color.
     */
    primary: PropTypes.bool,

    /**
     * Boolean if the button should be styled with the secondary color.
     */
    secondary: PropTypes.bool,

    /**
     * Boolean if the button is disabled.
     */
    disabled: PropTypes.bool,

    /**
     * An optional href to convert the button into a link button.
     */
    href: PropTypes.string,

    /**
     * An optional function to call when the button is clicked.
     */
    onClick: PropTypes.func,
  };

  static defaultProps = {
    type: 'button',
    iconBefore: true,
  };

  render() {
    const { className, ...props } = this.props;
    return <Button {...props} className={cn('md-flat-btn', className)} />;
  }
}