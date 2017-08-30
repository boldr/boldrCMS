/* @flow */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import Loader from '@boldr/ui/Loader';
// internal
import { showModal, hideModal } from '@boldr/core';
import type { User } from '../../../types/boldr';
import { memberSelected, updateMember } from '../state';
import Members from './Members';
import MEMBERS_QUERY from './users.graphql';

type Data = {
  getUsers: Array<User>,
  loading: boolean,
};

export type Props = {
  data: Data,
  currentMember: User,
  dispatch: Function,
  ui: Object,
};
type State = {
  userId: string,
};
export class MembersContainer extends Component<Props, State> {
  static defaultProps: {
    profile: {},
    fetchMembersIfNeeded: () => {},
  };
  constructor(props: Props) {
    super(props);
    (this: any).toggleUser = this.toggleUser.bind(this);
    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).closeModal = this.closeModal.bind(this);
    (this: any).openModal = this.openModal.bind(this);
  }
  state: State = { userId: '' };

  props: Props;

  closeModal() {
    this.props.dispatch(hideModal());
  }
  openModal() {
    this.props.dispatch(showModal());
  }

  toggleUser(user: Object) {
    const { dispatch } = this.props;
    dispatch(memberSelected(user));
    dispatch(showModal());
  }

  handleSubmit(values: Object) {
    const userData = {
      username: values.username,
      firstName: values.firstName,
      lastName: values.lastName,
      role: values.role,
      id: this.props.currentMember.id,
    };

    this.props.dispatch(updateMember(userData));
  }
  render() {
    const { loading, getUsers } = this.props.data;
    const { ui, currentMember } = this.props;
    if (loading) {
      return <Loader />;
    }
    return (
      <Members
        toggleUser={this.toggleUser}
        users={getUsers}
        visible={ui.modal}
        close={this.closeModal}
        handleSubmit={this.handleSubmit}
        initialValues={currentMember}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    ui: state.boldr.ui,
    currentMember: state.admin.members.currentMember,
  };
};

const MembersContainerWithData = graphql(MEMBERS_QUERY, {
  options: props => ({
    variables: {
      offset: 0,
      limit: 20,
    },
  }),
})(MembersContainer);
export default connect(mapStateToProps)(MembersContainerWithData);
