var html, fs = require('fs');
fs.readFile('index.html', (err, data) => html = data);


require('http').createServer(function (req, res) {
//   var validFile, fd;
//   fs.readFile(req.url.substring(1), (err, data) => {
//     validFile = !error
//     if (validFile)
//       fd = data;
//   });
  if (req.url.contains('.js')){
    var fd;
    fs.readFile(req.url.substring(1), (err, data) => {
      fd = data;
    });
    res.end(data);
  } else
    res.end(html);
}).listen(80);
