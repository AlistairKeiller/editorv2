import { Doc } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import { editor } from 'monaco-editor';
import * as Doppio from 'doppiojvm';

function copyDir(src, dest) {
  fs.mkdir(dest, e => {
    fs.readdir(src, (e, files) => {
      files.forEach(file => {
        var srcFile = path.resolve(src, file), destFile = path.resolve(dest, file);
        fs.stat(srcFile, (e, stat) => {
          stat.isDirectory() ?
          copyDir(srcFile, destFile) :
          fs.readFile(srcFile, (e, data) => {
            fs.writeFile(destFile, data);
          });
        });
      });
    });
  });
}
  
function extract(data, fs) {
  var mfs = new BrowserFS.FileSystem.MountableFileSystem();
  mfs.mount('/ziped', new BrowserFS.FileSystem.ZipFS(new Buffer(data)));
  mfs.mount('/unziped', fs);
  BrowserFS.initialize(mfs);
  copyDir('/ziped', '/unziped');
}

const ydoc = new Doc(),
provider = new WebrtcProvider(window.location.pathname, ydoc),
mEditor = editor.create(document.getElementById('monaco-editor'), {
  language: 'java',
  theme: 'vs-dark',
  automaticLayout: true,
  wordWrap: 'on',
  minimap: {
    enabled: false
  }
}),
monacoBinding = new MonacoBinding(
  ydoc.getText(),
  mEditor.getModel(),
  new Set([mEditor]),
  provider.awareness
);

fetch('doppio_home.zip')
  .then(r => r.arrayBuffer())
  .then(d => {
    process.initializeTTYs();
    process.stdout.on('data', function(data) {
      console.log(data.toString());
    });
    process.stderr.on('data', function(data) {
      console.log(data.toString());
    });
  
    home = new BrowserFS.FileSystem.InMemory();
  
    extract(d, home);

    var mfs = new BrowserFS.FileSystem.MountableFileSystem();
    mfs.mount('/home', home);
    mfs.mount('/tmp', new BrowserFS.FileSystem.InMemory());
    BrowserFS.initialize(mfs);
    
    var button = document.getElementById('loadButton');
    button.id = 'runButton';
    button.onclick = () => {
      if (button.id === 'runButton'){
        button.id = 'runningButton';
        fs.writeFile('/tmp/Main.java', mEditor.getValue());
        Doppio.VM.CLI(
          ['/home/Javac', '/tmp/Main.java'],
          {doppioHomePath: '/home'}, 
          e => {
            if (e === 0)
              Doppio.VM.CLI(
                ['/tmp/Main'],
                {doppioHomePath: '/home'},
                () => {button.id = 'runButton';}
              );
        });
      }
    }
    });
