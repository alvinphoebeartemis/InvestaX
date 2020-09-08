function helper () {
  // Helper to get files in a directory
  Object.defineProperty(this, 'getFiles', {
    value: (dir = '', files_ = []) => {
      const files = fs.readdirSync(dir)

      for (let i = 0; i < files.length; i++) {
        const name = `${dir}/${files[i]}`;

        if (!fs.statSync(name).isDirectory()){
          files_.push(`${files[i]}`);
        }
      }
      return files_;
    }
  });

  // Get list of directory
  Object.defineProperty(this, 'getDirectory', {
    value: (dir = '') => {
      return fs.readdirSync(dir, { withFileTypes: true }).filter(item => item.isDirectory());
    }
  });

}

module.exports = helper;
