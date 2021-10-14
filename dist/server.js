var http = require('http'),
  fs = require('fs'),
  mime = require('mime'),
  fileMap = new Map();

function createServer() {
  http
    .createServer((req, res) => {
      file = req.url.substring(1);
      if (!fileMap.has(file)) file = 'index.html';
      res.setHeader('Content-Type', fileMap.get(file).mime);
      res.end(fileMap.get(file).data);
    })
    .listen(80);
}

fs.readdir(__dirname, (e, files) => {
  files.forEach((file) => {
    fs.readFile(file, (e, d) => {
      fileMap.set(file, { data: d, mime: mime.getType(file) });
      if (fileMap.size === files.length) createServer();
    });
  });
});
