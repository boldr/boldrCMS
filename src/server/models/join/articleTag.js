import { Model } from 'boldr-orm';
import Tag from '../Tag';
import Article from '../Article';

/**
 * This is the join table connecting tags to articles.
 *
 * @see ../Tag
 * @see ../Article
 * @extends ../BaseModel
 */
class ArticleTag extends Model {
  static get tableName() {
    return 'article_tag';
  }

  static addTimestamps = false;

  static get idColumn() {
    return ['articleId', 'tagId'];
  }

  static get relationMappings() {
    return {
      tag: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tag,
        join: {
          from: 'article_tag.tagId',
          to: 'tag.id',
        },
      },
      article: {
        relation: Model.BelongsToOneRelation,
        modelClass: Article,
        join: {
          from: 'article_tag.articleId',
          to: 'article.id',
        },
      },
    };
  }
}

export default ArticleTag;