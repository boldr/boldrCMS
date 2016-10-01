import express from 'express';
import ensureAuthenticated from '../auth/ensureAuthenticated';
import { processQuery } from '../../utils';
import * as ctrl from './post.controller';

const router = express.Router();

router.route('/')
      .get(processQuery, ctrl.index)
      .post(ensureAuthenticated, ctrl.create);

router.route('/slug/:slug')
      .get(ctrl.getSlug);

router.route('/pid/:id')
      .get(ctrl.getId)
      .post(ctrl.addTag)
      .put(ctrl.update)
      .delete(ctrl.destroy);

export default router;
