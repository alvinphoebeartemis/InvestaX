/***************************************
    ____  _           _
    |  _ \| |__   ___ | |_ ___  ___
    | |_) | '_ \ / _ \| __/ _ \/ __|
    |  __/| | | | (_) | || (_) \__ \
    |_|   |_| |_|\___/ \__\___/|___/
    Photos related API
*****************************************/

const express = require('express');
const router = express.Router();
const multer = require('multer');
const GlobalHelper = require('../helper/globalHelper');

/**
 * @API POST /photos/list
 * @description Returns the list of photos.
 */
router.post('/list', (req, res) => {
  const { skip = 1, limit = 5 } = req.body || {};
  const globalHelper = new GlobalHelper();
  const path = `${APP_PATH}/albums`;
  const dirList = globalHelper.getDirectory(path) || [];
  const fileList = [];

  console.log(`[PAYLOAD] POST /photos/list ${JSON.stringify(req.body)}`);

  // Validator
  if (skip < 0 || isNaN(skip)) {
    return res.status(400).send({ message: 'Invalid Parameter: [skip]'});
  }
  if (limit < 0 || isNaN(limit)) {
    return res.status(400).send({ message: 'Invalid Parameter: [limit]'});
  }

  try {

    // Get directory
    for (let i = 0; i < dirList.length; i++) {
      const { name = '' } = dirList[i];
      const fileDir = globalHelper.getFiles(`${path}/${name.toLowerCase()}`) || [];

      // Get all files in the directory
      for (let j = 0; j < fileDir.length; j++) {
        const fileName = fileDir[j];
        fileList.push({
          id: md5(`${name}_${fileName}`),
          album: globalHelper.capitalize(name),
          name: fileName,
          path: `/albums/${name.toLowerCase()}/${fileName}`,
          raw: `http://localhost:${APP_PORT}/photos/${name.toLowerCase()}/${fileName}`
        })
      }
    }

    res.json({
      message: "OK",
      documents: fileList.splice(limit * skip, limit) || []
    });

  } catch (e) {
    console.error(e);
  }
});

/**
 * @API PUT /photos
 * @description Enables multiple file uploads.
 */
router.put('/', (req, res) => {
  const uploadedFile = [];
  const uploader =  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const { album = '' } = req.body;
        cb(null, `./albums/${album.toLowerCase()}`)
      },
      filename: (req, file, cb) => {
        const { album = '' } = req.body;
        const fileName = file.originalname.replace(/ /g,"_");

        uploadedFile.push({
          album,
          name: fileName,
          path: `/albums/${album.toLowerCase()}/${fileName}`,
          raw: `http://localhost:${APP_PORT}/photos/${album.toLowerCase()}/${fileName}`
        })

        cb(null, fileName)
      }
    })
  }).array('documents', 10)

  uploader(req, res, (error) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: 'Upload Failed' })
    }

    res.json({
      message: 'OK',
      data: uploadedFile
    })
  })
});

/**
 * @API DELETE /photos/:album/:fileName
 * @description Delete a photo on an album.
 */
router.delete('/:album/:fileName', (req, res) => {
  const { album = '', fileName = '' } = req.params || {};
  const basePath = `${APP_PATH}/albums`;

  console.log(`[PAYLOAD] DELETE /photos/:album/:fileName ${JSON.stringify(req.params)}`);

  // Validator
  if (!album) {
    return res.status(400).send({ message: 'Invalid Parameter: [album]'});
  }
  if (!fileName) {
    return res.status(400).send({ message: 'Invalid Parameter: [fileName]'});
  }

  fs.unlink(`${basePath}/${album.toLowerCase()}/${fileName}`, (error) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: 'File delete failed.' })
    }

    res.json({
      message: "OK"
    });
  })
});


/**
 * @API DELETE /photos
 * @description Deletes multiple files.
 */
router.delete('/', (req, res) => {
  const toDelete = req.body || [];
  const basePath = `${APP_PATH}/albums`;
  const filesToDelete = [];

  console.log(`[PAYLOAD] DELETE /photos ${JSON.stringify(req.params)}`);

  // Validator
  if (!toDelete.length) {
    return res.status(400).send({ message: 'Nothing to delete.'});
  }

  // Prepare files to delete
  for (let i = 0; i < toDelete.length; i++) {
    const { album = '', documents = '' } = toDelete[i];
    const _tmp = documents
      .split(',')
      .map(o => o.trim())

    for (let j = 0; j < _tmp.length; j++) {
      filesToDelete.push({ album, fileName: _tmp[j] })
    }
  }

  // Start deleting photos
  async.forEachOf(filesToDelete, (file, i, cb) => {
    const { album = '', fileName = '' } = file;

    console.log(`Deleting Files: /albums/${album.toLowerCase()}/${fileName}...`)

    fs.unlink(`${basePath}/${album.toLowerCase()}/${fileName}`, cb)
  }, (error) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: 'File delete failed.' })
    }

    res.json({
      message: "OK"
    });
  })
});


/**
 * @API GET /photos/:album/:fileName
 * @description Reads a photo on an album.
 */
router.get('/:album/:fileName', (req, res) => {
  const { album = '', fileName = '' } = req.params || {};
  const basePath = `${APP_PATH}/albums`;

  console.log(`[PAYLOAD] GET /photos ${JSON.stringify(req.params)}`);

  // Validator
  if (!album) {
    return res.status(400).send({ message: 'Invalid Parameter: [album]'});
  }
  if (!fileName) {
    return res.status(400).send({ message: 'Invalid Parameter: [fileName]'});
  }

  const stream = fs.createReadStream(`${basePath}/${album.toLowerCase()}/${fileName}`);

  stream.on('error', function(error) {
    res.status(404)
    res.end('File Not Found');
  });

  stream.pipe(res);
});

module.exports = router;
