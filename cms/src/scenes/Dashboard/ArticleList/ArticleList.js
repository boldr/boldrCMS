/* @flow */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Paper from 'components/md/Papers';
import { DataTable, TableHeader, TableBody, TableRow, TableColumn } from 'components/md/DataTables';
import { Row } from 'components/index';

import { changePostStatus } from 'state/dux/post';
import ArticleListItem from 'components/ArticleListItem';


export type Props = {
  children?: React$Element<any>,
  posts?: Object,
  dispatch?: Function,
  current?: Object
};

class ArticleList extends Component {
  constructor(props: Props) {
    super(props);
    this.handleArticleClick = this.handleArticleClick.bind(this);
  }

  props: Props;
  // postId is a uuid, not an integer
  handleArticleClick(postId: string): void {
    console.log('clicked ', postId);
  }

  render() {
    return (
      <Row>
       <Paper zDepth={ 1 } style={ { height: '90vh' } }>

       <DataTable className="complex-table">
       <TableHeader>
          <TableRow>
             <TableColumn>
               Title
             </TableColumn>
            <TableColumn>
               Status
             </TableColumn>
             <TableColumn>
               Date
             </TableColumn>
             <TableColumn>
               Action
             </TableColumn>
           </TableRow>
         </TableHeader>
         <TableBody>
        {
          this.props.posts.entities.map((post, index) => (
           <ArticleListItem
             article={ post }
             created_at={ post.created_at }
             key={ post.id }
             sortRank={ index }
             content={ post.content }
             title={ post.title }
             slug={ post.slug }
             handleArticleClick={ this.handleArticleClick }
           />
         ))
        }
         </TableBody>
        </DataTable>
        </Paper>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    posts: state.posts
  };
};
export default connect(mapStateToProps)(ArticleList);
