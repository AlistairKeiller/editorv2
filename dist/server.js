var html, fs = require('fs');
fs.readFile('index.html', (err, data) => html = data);


require('http').createServer(function (req, res) {
//   var fd;
//   fs.readFile(req.url.substring(1), (err, data) => fd = data);
//   if (fd)
//     res.end(fd);
//   else
    res.end(html);
}).listen(80);
