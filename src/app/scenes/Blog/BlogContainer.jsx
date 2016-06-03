import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchArticles } from 'app/state/article/article.actions';
import Loader from '../../components/Loader';
import Article from './Article';

class BlogContainer extends Component {
  static loadAsyncData(dispatch) {
    return dispatch(fetchArticles());
  }

  constructor(props) {
    super(props);
    this.createArticleList = (articleList) => this._createArticleList(articleList);
  }

  componentDidMount() {
    this.constructor.loadAsyncData(this.props.dispatch);
  }

  _createArticleList(articles) {
    const articleList = [];
    for (let article of articles) { // eslint-disable-line
      articleList.push(
        <div key={ article.articleId }>
          <Article {...article} />
        </div>
      );
    }
    return articleList;
  }
  render() {
    const { loading, article } = this.props;
    let articleList = this.createArticleList(this.props.article.articles);

    return (
      <div>

       <div className="container">
         BlogContainer?
         { articleList }
       </div>
      </div>
      );
  }
}

BlogContainer.propTypes = {
  loading: PropTypes.bool,
  article: PropTypes.object,
  dispatch: PropTypes.func
};

const mapStateToProps = (state) => ({
  article: state.article,
  loading: state.article.loading
});

export default connect(mapStateToProps, null)(BlogContainer);