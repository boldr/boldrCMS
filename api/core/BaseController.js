import findQuery from 'objection-find';
import { searchFilter, responseHandler, throwNotFound } from '../utils';

class BaseController {

  constructor(model, id = 'id', eager) {
    this.model = model;
    this.eager = eager;
    this.id = id;
  }

  create(req, res) {
    return this.model.query()
      .insert(req.body)
      .then(item => responseHandler(null, res, 201, item))
      .catch(err => responseHandler(err, res));
  }

  update(req, res) {
    return this.model.query()
      .patchAndFetchById(req.params[this.id], req.body)
      .then(item => responseHandler(null, res, 200, item))
      .catch(err => responseHandler(err, res));
  }

  index(req, res) {
    return findQuery(this.model)
      .allowEager(this.eager)
      .registerFilter('search', searchFilter)
      .build(req.query.where)
      .eager(req.query.include)
      // .orderBy(req.query.sort.by, req.query.sort.order)
      .page(req.query.page.number, req.query.page.size)
      .then(items => responseHandler(null, res, 200, items))
      .catch(err => responseHandler(err, res));
  }

  show(req, res) {
    return this.model.query()
      .findById(req.params[this.id])
      .allowEager(this.eager)
      .eager(req.query.eager)
      .then(item => {
        if (!item) return throwNotFound(res);
        return responseHandler(null, res, 200, item);
      })
    .catch(err => responseHandler(err, res));
  }

  destroy(req, res) {
    return this.model.query()
      .deleteById(req.params[this.id])
      .then(() => responseHandler(null, res, 204))
      .catch(err => responseHandler(err, res));
  }
}

export default BaseController;
