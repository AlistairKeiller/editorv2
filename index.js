const html = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
</head>
<body>

<div id="container" style="width:800px;height:600px;border:1px solid grey"></div>

<script src="monaco-editor/min/vs/loader.js"></script>
<script>
    require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        var editor = monaco.editor.create(document.getElementById('container'), {
            value: [
                'function x() {',
                '\tconsole.log("Hello world!");',
                '}'
            ].join('\n'),
            language: 'javascript'
        });
    });
</script>
</body>
</html>`

require('http').createServer((req, res) => {
  console.log(req.url)
  res.end(html)
}).listen(80)
