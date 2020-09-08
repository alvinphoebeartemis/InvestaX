const multer = require('multer');

function helper () {
  // Helper to get files in a directory
  Object.defineProperty(this, 'uploader', {
    value: (req, res, done) => {

      const upload = multer({
        storage : multer.diskStorage({
          destination: (req, file, cb) => cb(null, `./albums`),
          filename: (req, file, cb) => {
            console.log(file.originalname)
            cb(null, file.originalname)
          }
        })
      }).any();

      console.log(`Start Uploading`);


      upload(req, res, done);
    }
  });
}

module.exports = helper;
