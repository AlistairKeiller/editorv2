var app, html, fs = require('fs');
fs.readFile('index.html', (err, data) => html = data);
fs.readFile('app.js', (err, data) => app = data);


require('http').createServer(function (req, res) {
  switch (req.url) {
    case '/':
      res.writeHead(302, {'Location': Math.random().toString().split(2)});
      res.end();
      break;
    case '/app.js':
      res.end(app);
      break;
    default:
      res.end(html);
  }
})
