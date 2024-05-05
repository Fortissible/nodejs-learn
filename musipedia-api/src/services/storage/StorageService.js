const fs = require('fs');
 
class StorageService {
  constructor(folder) {
    this._folder = folder;
 
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }
 
  writeFile(albumId, file, meta) {
    const filename = albumId + meta.filename;
    const path = `${this._folder}/${filename}`;

    console.log(`meta filename ${meta}`);
 
    const fileStream = fs.createWriteStream(path);
 
    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;