import { Doc } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import { editor } from 'monaco-editor';
import * as Doppio from 'doppiojvm';

var ydoc = new Doc(),
provider = new WebrtcProvider(window.location.pathname, ydoc),
mEditor = editor.create(document.getElementById('monaco-editor'), {
  language: 'java',
  theme: 'vs-dark',
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

fetch('https://plasma-umass.org/doppio-demo/doppio_home.zip')
  .then(d => d.arrayBuffer())
  .then(d => {
    const fs = BrowserFS.BFSRequire('fs'), path = BrowserFS.BFSRequire('path'), Buffer = BrowserFS.BFSRequire('buffer').Buffer, process = BrowserFS.BFSRequire('process');

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

//     process.initializeTTYs();
//     process.stdout.on('data', d => {
//       console.log(d.toString());
//     });
//     process.stderr.on('data', d => {
//       console.log(d.toString());
//     });

    var mfs = new BrowserFS.FileSystem.MountableFileSystem();
    mfs.mount('/zip_home', new BrowserFS.FileSystem.ZipFS(new Buffer(d)));
    mfs.mount('/home', new BrowserFS.FileSystem.InMemory());
    mfs.mount('/tmp', new BrowserFS.FileSystem.InMemory());
    BrowserFS.initialize(mfs);
    copyDir('/zip_home', '/home');
    
//     var button = document.getElementById('loadButton');
//     button.id = 'runButton';
    
    Doppio.VM.CLI(
      ['/home/classes/demo/Chatterbot'],
      {doppioHomePath: '/home'}
    );
    
    // button.onclick = () => {
    //   if (button.id === 'runButton'){
    //     console.log(mEditor.getValue())
    //     button.id = 'runningButton';
    //     fs.writeFile('/tmp/Main.java', mEditor.getValue(), () => {
    //       Doppio.VM.CLI(
    //       ['/home/Javac', '/tmp/Main.java'],
    //       {doppioHomePath: '/home'}, 
    //       e => {
    //         if (e === 0)
    //           Doppio.VM.CLI(
    //             ['/tmp/Main'],
    //             {doppioHomePath: '/home'},
    //             () => {button.id = 'runButton';}
    //           );
    //     });
    //     });
    //   }
    // }
    });
