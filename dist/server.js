var http = require('http'),
  fs = require('fs'),
  mime = require('mime'),
  fileMap = {};

function createServer() {
  http
    .createServer((req, res) => {
      var file = req.url.substring(1);
      if (!fileMap.hasOwnProperty(file)) file = '404.html';
      res.setHeader('Content-Type', fileMap[file].mime);
      res.end(fileMap[file].data);
    })
    .listen(8080);
}

fs.readdir(__dirname, (e, files) => {
  files.forEach((file) => {
    fs.readFile(file, (e, d) => {
      fileMap[file] = { data: d, mime: mime.getType(file) };
      if (Object.keys(fileMap).length === files.length) createServer();
    });
  });
});
