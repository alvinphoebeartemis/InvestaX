const express = require('express');
const router = express.Router();
const md5 = require('md5');
const GlobalHelper = require('../helper/globalHelper');

/**
 * POST /photos/list
 *
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
      const fileDir = globalHelper.getFiles(`${path}/${name}`) || [];

      // Get all files in the directory
      for (let j = 0; j < fileDir.length; j++) {
        const fileName = fileDir[j];
        fileList.push({
          id: md5(fileName),
          album: name,
          name: fileName,
          path: `/albums/${name}/${fileName}`,
          raw: `http://localhost:8888/albums/${name}/${fileName}`
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

module.exports = router;
