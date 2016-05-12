import _debug from 'debug';
import slug from 'slugg';
import r from 'server/db';
const debug = _debug('boldr:article:controller');
debug('init');

export async function getAllArticles(ctx) {
  const articles =
  await r.table('articles')
  .eqJoin('authorId', r.table('users'))// returns left and right joins
  .zip()// zip combines the two tables into one on request.
  .run();
  return ctx.ok(articles);
}

/**
 * @description
 * creates a new article
 * @route /api/v1/articles
 * @method POST
 */
export const createArticle = async (ctx, next) => {
  const article = {
    title: ctx.request.body.title,
    slug: slug(ctx.request.body.slug),
    markup: ctx.request.body.markup,
    content: ctx.request.body.content,
    featureImage: ctx.request.body.featureImage,
    authorId: ctx.state.user.id,
    isDraft: ctx.request.body.isDraft
  };
/*
r.table('articles_tags').eq_join('article_id', r.table('articles')).zip()
.eq_join('tag_id', r.table('tags')).zip().run();
 */
  try {
    await r.table('articles').insert(article).run();
    return ctx.created(article);
  } catch (err) {
    return ctx.error('Something went terribly wrong creating your article. Try again.');
  }
};

export const showArticle = async (ctx) => {
  const article = await r.table('articles').get(ctx.params.id).run();
  return ctx.ok(article);
};

/**
 * looks up an article by the slug, which is a sanitized version of its title.
 * @param  {Object}   ctx  slug
 * @return {Object}        The article
 */
export const getArticleBySlug = async (ctx, next) => {
  const article = await r.table('articles').filter({ slug: ctx.params.slug }).run();
  return ctx.ok(article);
};
