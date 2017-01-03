/* @flow */
import React from 'react';
import { connect } from 'react-redux';

import PageTemplate from '../../theme/Boldr';
import type { ReactElement } from '../../types/react';

type Props = { children: ReactElement, auth: Object }; // eslint-disable-line

const Account = (props: Props) => {
  return (
    <div>
      <PageTemplate>
        { props.children }
      </PageTemplate>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    auth: state.account.auth,
  };
}

export default connect(mapStateToProps)(Account);
