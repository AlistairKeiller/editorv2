var html, fs = require('fs');
fs.readFile('index.html', (err, data) => html = data);


require('http').createServer(function (req, res) {
  if (req.url == '/')
    res.end(html);
  else{
    var fd;
    fs.readFile(req.url.substring(1), (err, data) => {
      fd = data;
    });
    res.end(data);
  }
}).listen(80);
