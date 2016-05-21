import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchArticles } from 'app/state/modules/article/article.actions';
import Loader from '../../components/Loader';
import Article from './components/Article';
import ReactRethinkdb from 'react-rethinkdb';
import reactMixin from 'react-mixin';

const r = ReactRethinkdb.r;
// Data that needs to be called before rendering the component
// This is used for server side rending via the fetchComponentDataBeforeRending() method
Article.need = [
  fetchArticles
];

class BlogContainer extends Component {

  constructor(props) {
    super(props);

    const { dispatch } = props;
    dispatch(fetchArticles());
  }
  observe(props, state) { // eslint-disable-line no-unused-vars
    return {
      articles: new ReactRethinkdb.QueryRequest({
        query: r.table('articles'), // RethinkDB query
        changes: true, // subscribe to realtime changefeed
        initial: []
      })
    };
  }
  render() {
    const { loading, article } = this.props;
    const articlesMap = () => {
      return (
        <Article articles={ this.props.article.articles } />
        );
    };
    return (
      <div>

       <div className="container">
         BlogContainer?
         { loading ? <Loader /> : <Article articles={ this.props.article.articles } /> }
       </div>
      </div>
      );
  }
}

BlogContainer.propTypes = {
  loading: PropTypes.bool,
  article: PropTypes.object
};

const mapStateToProps = (state) => ({
  article: state.article,
  loading: state.article.loading
});
reactMixin.onClass(BlogContainer, ReactRethinkdb.DefaultMixin);
export default connect(mapStateToProps, null)(BlogContainer);
