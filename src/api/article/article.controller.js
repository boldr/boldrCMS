import slug from 'limax';
import Boom from 'boom';

import { Article, User, Tag, ArticleTag } from '../../db/models';

const MAX_TAGS = 15;
/**
 * @api {get} /articles       Get all articles
 * @apiVersion 1.0.0
 * @apiName getAllArticles
 * @apiGroup Article
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3000/api/v1/articles
 *
 * @apiSuccess {String}  id   The Article ID
 */

export const getAllArticles = async (req, res, next) => {
  try {
    const articles = await Article.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'displayName', 'picture', 'email']
      }, {
        model: Tag,
        attributes: ['tagname', 'id']
      }
    ]
    });

    return res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};
/**
 * @api {get} /articles/:id  Get a specific article by its id
 * @apiVersion 1.0.0
 * @apiName ShowArticle
 * @apiGroup Article
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3000/api/v1/articles/1
 *
 * @apiParam {String}    id   The article's id.
 *
 * @apiSuccess {String}  id   The Article ID
 */
export const showArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'displayName', 'picture', 'email', 'role']
      }, {
        model: Tag,
        attributes: ['tagname', 'id']
      }]
    });
    return res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

export async function addTagToArticle(req, res) {
  const articleId = req.params.articleId;
  const alreadyAddedError = () => {
    const error = { message: 'Could not add tag to the article. Is it already added?' };
    console.log(res, error);
  };
  if (req.body.tagname !== undefined) {
    Tag.findOrCreate({
      where: {
        tagname: req.body.tagname.toLowerCase().trim()
      }
    }).spread(tag =>
        ArticleTag.create({
          articleId,
          tagId: tag.id
        }).then(() => {
          const json = tag.toJSON();
          json.article_count = 1;
          res.status(201).send(json);
        }).catch(alreadyAddedError)
      ).catch(err => {
        console.log(res, err);
      });
  } else if (req.body.id !== undefined) {
    const id = req.body.id;
    ArticleTag.create({
      articleId,
      tagId: id
    }).then(obj => {
      const json = obj.toJSON();
      res.status(201).send({ error: false, data: json });
    }).catch(alreadyAddedError);
  } else {
    console.log('err');
  }
}
/**
 * Creates a new article and saves it to the database.
 * @method createArticle
 * @param {String}  title          the title of the article
 * @param {String}  slug           the title normalized without spaces.
 * @param {String}  markup         any HTML from the post body
 * @param {String}  content        the article body
 * @param {String}  featureImage   an image to go along with the article
 * @param {Number}  authorId       the userId associated with the creator of the article
 * @param {ENUM}    status        whether or not the article is published
 * @param {Date}    createdAt      the time the article was saved.
 * @return {Object}                the article object
 */
export const createArticle = async(req, res, next) => {
  if (req.body.tags) {
    req.body.tags = req.body.tags.split(',', MAX_TAGS).map(tag => tag.substr(0, 15));
  }
  try {
    const article = await Article.create({
      title: req.body.title,
      slug: slug(req.body.title),
      excerpt: req.body.excerpt,
      markup: req.body.markup,
      content: req.body.content,
      featureImage: req.body.featureImage,
      authorId: req.user.id,
      status: req.body.status,
      tags: []
    }, { include: [{ model: Tag, as: 'tags' }] });
    // creates a new "Tag" for every tag in ctx.request.body.tags
    for (let i = 0; i < req.body.tags.length; i++) {
      const newTag = await Tag.create({
        tagname: req.body.tags[i]
      });
      await article.addTag(newTag);
      // Adds articleId of the previously created Article and
      // adds the tagId of each created Tag to the ArticlesTags table.
    }
    // Performs a quick get to save an api req.
    if (req.body.tags) {
      article.tags = req.body.tags.map(tag => ({ tagname: tag }));
    }
    return res.status(201).json(article);
  } catch (error) {
    return res.status(400).json(error);
  }
};
