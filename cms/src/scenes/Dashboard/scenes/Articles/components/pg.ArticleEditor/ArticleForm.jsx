import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import { RadioButton } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Editor, EditorState } from 'draft-js';

import Paper from 'material-ui/Paper';
// import BoldrEditor from 'components/org.BoldrEditor';
import TextEditor from 'components/org.Editor/Editor/Editor';
import classNames from 'classnames/bind';
import styles from './style.css';

const cx = styles::classNames;
const style = {
  block: {
    maxWidth: 250
  },
  toggle: {
    marginBottom: 16
  },
  margin: 12
};
const radioStyle = {
  display: 'inline',
  marginTop: '20px',
  float: 'right'
};
class NewArticleForm extends Component {
  constructor(props) {
    super(props);

    this.onChange = (value) => {
      this.setState({
        value
      });
    };

    this.getMarkup = (markup) => {
      this.setState({
        markup
      });
    };

    this.renderInnerMarkup = () => this._renderInnerMarkup();
    this.renderReturnedContent = (value) => this._renderReturnedContent(value);

    this.state = {
      tags: []
    };
  }
  handleChange(tags) {
    this.setState({
      tags
    });
  }
  render() {
    const { fields: { title, tags, excerpt, content, status, featureImage }, handleSubmit } = this.props;
    const { editorState } = this.state;
    return (
      <section>
      <form onSubmit={ handleSubmit }>
          <div className={ cx('articleEditor__left') }>
            <Paper
              zDepth={ 3 }
              style={ {
                padding: 40
              } }
            >

              <div className={ cx('row') }>
                <TextField hintText= "Give it a name"
                  floatingLabelText="Title"
                  fullWidth
                  errorText = { title.touched && title.error }
                  { ...title }
                />
              </div>
              <div className={ cx('row') }>
                <TextField hintText= "Separate using commas"
                  floatingLabelText="Tags"
                  fullWidth
                  errorText = { tags.touched && tags.error }
                  { ...tags }
                />
              </div>
              <div className={ cx('row') }>
                <TextField hintText= "An image to go with your article"
                  floatingLabelText="Feature Image"
                  fullWidth
                  errorText = { featureImage.touched && featureImage.error }
                  { ...featureImage }
                />
              </div>
              <div className={ cx('row') }>
                <TextField hintText= "A short summary or highlight"
                  floatingLabelText="Excerpt"
                  fullWidth
                  errorText = { excerpt.touched && excerpt.error }
                  { ...excerpt }
                />
              </div>
              <div className={ cx('row') }>
                <label>
                  <input type="radio" { ...status } value="draft" checked={ status.value === 'draft' } /> Draft
                </label>
                <label>
                  <input type="radio" { ...status } value="published" checked={ status.value === 'published' } /> Published
                </label>
              </div>
              <div style={ { marginTop: '1em' } }>
                <RaisedButton type="submit" secondary label="Publish" style={ style } />
              </div>
            </Paper>
          </div>
          <div className={ cx('articleEditor__right') }>
            <Paper
              zDepth={ 3 }
            >
              <TextEditor { ...content }
                handleUpdate={ (value) => {
                  content.onChange(value);
                } }
              />
            </Paper>
          </div>
      </form>
      </section>
      );
  }
}

export default reduxForm({
  form: 'NewArticleForm',
  fields: ['title', 'tags', 'excerpt', 'content', 'featureImage', 'status']
})(NewArticleForm);

NewArticleForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};