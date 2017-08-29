/* eslint-disable no-return-assign, react/no-unused-state, no-implicit-coercion */
// @flow
import * as React from 'react';

import Link from 'react-router-dom/Link';
import NavLink from 'react-router-dom/NavLink';

import {
  Icon,
  Container,
  Navbar,
  NavbarBrand,
  NavbarBurger,
  NavbarEnd,
  NavbarItem,
  NavbarMenu,
  NavbarStart,
} from '@boldr/ui';
// internal
import NavItem from './NavItem';

export type Props = {
  me?: User,
  isMobile: boolean,
  auth: Object,
  showHeader: () => void,
  loading: boolean,
  logout: Function,
  data?: Object,
  location: Object,
  menu: Object,
  settings?: Array<Setting>,
  currentUser: User,
  logoImg?: string,
  breakpoint?: number,
  onLogout: Function,
};

type State = {
  isActive: boolean,
  isDropdownOpen: boolean,
};

export const checkActiveLoc = (location: Object, url: string) => {
  return !!location.pathname.includes(url);
};

class Navigation extends React.Component<Props, State> {
  state: State = { isActive: false, isDropdownOpen: false };

  onClickNav = () => {
    this.setState(state => ({ isActive: !state.isActive }));
  };

  onClickDropdown = () => {
    this.setState(state => ({ isDropdownOpen: !state.isDropdownOpen }));
  };
  onLogoutClick = () => {
    this.props.onLogout();
  };
  props: Props;
  render() {
    const { menu: { details }, settings, currentUser, location, auth } = this.props;
    const { isActive } = this.state;
    return (
      <Navbar
        ref={el => {
          (this: any).navbar = el;
        }}>
        <Container>
          <NavbarBrand>
            <NavbarItem>
              <Link to="/">
                <img src="https://boldr.io/assets/boldr-logo.png" />
              </Link>
            </NavbarItem>
            <NavbarBurger isActive={isActive} onClick={this.onClickNav} />
          </NavbarBrand>
          <NavbarMenu isActive={isActive} onClick={this.onClickNav}>
            <NavbarStart>
              {details.map(detail =>
                <NavItem
                  key={detail.id}
                  isActive={checkActiveLoc(location, detail.href)}
                  {...detail}
                />,
              )}
            </NavbarStart>
            <NavbarEnd>
              {auth.token &&
                parseInt(currentUser.roleId, 10) === 3 &&
                <NavbarItem>
                  <NavLink to="/admin">
                    <Icon kind="dashboard" />
                  </NavLink>
                </NavbarItem>}
              {!auth.token &&
                <NavbarItem>
                  <NavLink to="/login">Login</NavLink>
                </NavbarItem>}
              {auth.token &&
                <NavbarItem>
                  <NavLink to={`/profiles/${currentUser.username}`}>
                    <Icon kind="account-card" />
                  </NavLink>
                </NavbarItem>}
              {auth.token &&
                <NavbarItem>
                  <Icon kind="logout" onClick={this.onLogoutClick} />
                </NavbarItem>}
              {!auth.token &&
                <NavbarItem href="/signup" title="Signup">
                  Signup
                </NavbarItem>}
            </NavbarEnd>
          </NavbarMenu>
        </Container>
      </Navbar>
    );
  }
}

export default Navigation;
