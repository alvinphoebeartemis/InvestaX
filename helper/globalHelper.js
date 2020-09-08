function helper () {
  // Helper to get files in a directory
  Object.defineProperty(this, 'getFiles', {
    value: (dir = '', files_ = []) => {
      const files = fs.readdirSync(dir)

      for (let i = 0; i < files.length; i++) {
        const name = `${dir}/${files[i]}`;

        // console.log(path.extname(files[i]))

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

  // Capitalize first letter
  Object.defineProperty(this, 'capitalize', {
    value: (s = '') => {
      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1)
    }
  });
}

module.exports = helper;
