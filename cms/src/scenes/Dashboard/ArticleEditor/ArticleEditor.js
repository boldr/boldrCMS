/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadPost, clearCurrentPost, updatePost } from '../../Blog/SinglePost/actions';
import EditorForm from 'components/EditorForm';

export type Props = {
  dispatch?: Function,
  posts?: Object,
  params?: Object,
  currentPost?: Object,
  clearCurrentPost?: Function,
  loadPost?: Function,
};

class ArticleEditor extends Component {
  constructor(props: Props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      editing: true
    };
  }

  componentDidMount() {
    this.props.loadPost(this.props.params.slug);
  }
  props: Props;
  handleSubmit(values) {
    const postData = {
      title: values.title,
      tags: values.tags,
      status: values.status,
      content: values.content,
      id: this.props.currentPost.id || '',
      origSlug: this.props.params.slug || ''
    };
    this.props.dispatch(updatePost(postData));
  }

  render() {
    if (this.props.currentPost.isLoading && !this.props.currentPost.content.length) {
      return <p>Loading...</p>;
    }
    return (
      <div>
        <EditorForm
          initialValues={ this.props.currentPost }
          onSubmit={ this.handleSubmit }
        />
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    posts: state.posts,
    currentPost: state.currentPost,
    isLoading: state.currentPost.isLoading
  };
};
export default connect(mapStateToProps, { loadPost, clearCurrentPost, updatePost })(ArticleEditor);
