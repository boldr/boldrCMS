import { Bookshelf } from '../connector';
import Post from './Post';

const User = Bookshelf.Model.extend({
  tableName: 'users',
  posts: () => this.hasMany(Post),
  initialize: function init() {
    this.on('updating', () => {
      this.attributes.updated_at = new Date();
    });

    this.on('creating', () => {
      this.attributes.created_at = new Date();
    });
  }
});

export default User;
