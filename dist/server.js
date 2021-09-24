var html, fs = require('fs');
fs.readFile('index.html', (err, data) => html = data);

require('http').createServer(function (req, res) {
  fs.readFile(__dirname + req.url, function (err,data) {
    if (err)
      res.end(html);
    else
      res.end(data);
  });
}).listen(80);
