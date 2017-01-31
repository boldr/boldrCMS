import path from 'path';
import Debug from 'debug';
import uuid from 'uuid';
import * as objection from 'objection';
import fs from 'fs-extra';
import shortId from 'shortid';
import Busboy from 'busboy';
import { responseHandler, BadRequest } from '../../core/index';
import getConfig from '../../../config/get';
import Activity from '../../models/activity';
import Attachment from '../../models/attachment';

const gm = require('gm').subClass({ imageMagick: true });

const regex = new RegExp('^.*.((j|J)(p|P)(e|E)?(g|G)|(g|G)(i|I)(f|F)|(p|P)(n|N)(g|G))$');
const debug = Debug('boldr:attachment-controller');

/**
 * Returns a list of all attachments
 * @method listAttachments
 * @param  {Object}        req  the request object
 * @param  {Object}        res  the response object
 * @return {Promise}            the array of attachment objects
 */
export async function listAttachments(req, res) {
  try {
    const medias = await Attachment.query();

    return responseHandler(res, 200, medias);
  } catch (error) {
    return res.status(500).json(error);
  }
}

/**
 * Returns a specific attachment and its data
 * @method getAttachment
 * @param  {Object}        req  the request object
 * @param  {Object}        res  the response object
 * @return {Promise}         the attachment object
 */
export async function getAttachment(req, res) {
  try {
    const media = await Attachment.query().findById(req.params.id);
    return responseHandler(res, 200, media);
  } catch (err) {
    return res.status(500).json(err);
  }
}

/**
 * Update an attachment in the database.
 * @method updateAttachment
 * @param  {Object}        req  the request object
 * @param  {Object}        res  the response object
 * @return {Object}             returns the response
 */
export function updateAttachment(req, res) {
  debug(req.body);
  return Attachment.query()
    .patchAndFetchById(req.params.id, req.body)
    .then(attachment => responseHandler(res, 202, attachment));
}

/**
 * Delete an attachment from the database and file system.
 * @method deleteAttachment
 * @param  {Object}        req  the request object
 * @param  {Object}        res  the response object
 * @param  {Function}       next move to the next middleware
 * @return {Promise}             Promise that the file deleted
 */
export async function deleteAttachment(req, res, next) {
  try {
    // query for the requested attachment
    const attachment = await Attachment.query().findById(req.params.id);
    // return a bad request if we cannot locate
    if (!attachment) {
      return next(new BadRequest());
    }
    // unlink the attachment from the activity
    await Activity.query().where({ activity_attachment: req.params.id }).first().then((activity) => {
      return activity.$relatedQuery('attachment').unrelate().where('activity_attachment', req.params.id);
    });
    // remove the attachment from the database
    await Attachment.query().deleteById(req.params.id);
    // remove from the file system.
    fs.removeSync(`./public/files/${attachment.safe_name}`);
    // send a 204
    return res.status(204).json('Deleted');
  } catch (error) {
    return next(new BadRequest(error));
  }
}

/**
 * Upload an attachment
 * @method uploadImage
 * @param  {Object}        req  the request object
 * @param  {Object}        res  the response object
 * @param  {Function}       next move to the next middleware
 * @return {Promise}       the newly created attachment
 */
export async function uploadImage(req, res, next) {
  let fstream;
  const busboy = new Busboy({ headers: req.headers });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    // if theres no file attached, return with error
    if (filename.length === 0) {
      return next(new BadRequest('No file selected!'));
    }
    // if the file extension doesnt match the regex, return a bad request.
    if (!filename.match(regex)) {
      return next(new BadRequest('Invalid file type'));
    }
    // define temporary file path before processing.
    const tmpFilePath = path.join(process.cwd(), './public/.tmp');
    // generate a shortid for the new file name and keep the ext
    const imgId = shortId.generate();
    // take the shortid and the extension to form the new file name
    const newFileName = imgId + path.extname(filename);
    // stream to file
    fstream = fs.createWriteStream(`./public/.tmp/${newFileName}`);
    // wrtie temporary file from stream
    file.pipe(fstream);
    // once file is written and close is emitted
    fstream.on('close', () => {
      // get the file from temp loc
      const fileLoc = path.join(tmpFilePath, newFileName);
      // create a readstream
      const readstream = fs.createReadStream(fileLoc);
      // send through graphicsmagick
      gm(readstream).noProfile().quality(70).write(`./public/files/${newFileName}`, async (err) => {
        if (err) {
          return res.status(500).send('Could not parse upload completely.');
        }
        // delete the temporary file
        fs.removeSync(fileLoc);
        // TODO: configure url based on config value.
        const newAttachment = await Attachment.query().insert({
          original_name: filename,
          user_id: req.user.id,
          file_name: newFileName,
          safe_name: newFileName,
          // path: `files/${newFileName}`,
          url: `/files/${newFileName}`,
          file_description: req.body.file_description,
          file_type: mimetype,
        });
        // create an activity entry
        await Activity.query().insert({
          user_id: req.user.id,
          action_type_id: 1,
          activity_attachment: newAttachment.id,
        });

        return res.status(201).json(newAttachment);
      });
    });
  });
  // if theres an error with busboy, return it.
  busboy.on('error', (error) => {
    console.log('Error', 'Something went wrong parsing the form', error);
    res.status(500).send('Could not parse upload completely.');
  });

  return req.pipe(busboy);
}
