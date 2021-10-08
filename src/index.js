import { Doc } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import { editor } from 'monaco-editor';
// import * as BrowserFS from 'browserfs';
// import * as Doppio from 'doppiojvm';

const ydoc = new Doc();
const provider = new WebrtcProvider(window.location.pathname, ydoc);

const mEditor = editor.create(document.getElementById('monaco-editor'), {
  language: 'java',
  theme: 'vs-dark',
  automaticLayout: true,
  wordWrap: 'on',
  minimap: {
    enabled: false
  }
});

const monacoBinding = new MonacoBinding(
  ydoc.getText(),
  mEditor.getModel(),
  new Set([mEditor]),
  provider.awareness
);

// BrowserFS.install(window);
// fs = BrowserFS.BFSRequire('fs'), path = BrowserFS.BFSRequire('path'), Buffer = BrowserFS.BFSRequire('buffer').Buffer, process = BrowserFS.BFSRequire('process');
// process.initializeTTYs();
// process.stdout.on('data', function(data) {
//   console.log(data.toString());
// });
// process.stderr.on('data', function(data) {
//   console.log(data.toString());
// });
// function copyDir(src, dest) {
//   fs.mkdir(dest, e => {
//     if (e && e.code !== 'EEXIST')
//       console.log(e);
//     fs.readdir(src, (e, files) => {
//       if (e)
//         console.log(e);
//       files.forEach(file => {
//         srcFile = path.resolve(src, file), destFile = path.resolve(dest, file);
//         fs.stat(srcFile, (e, stat) => {
//           if (e)
//             console.log(e);
//           stat.isDirectory() ?
//           copyDir(srcFile, destFile) :
//           fs.readFile(srcFile, (e, data) => {
//             if (e)
//               console.log(e);
//             fs.writeFile(destFile, data);
//           });
//         });
//       });
//     });
//   });
// }
// fetch('doppio_home.zip')
//   .then(r => r.arrayBuffer())
//   .then(d => {
//     mfs = new BrowserFS.FileSystem.MountableFileSystem();
//     mfs.mount('/zip_home', new BrowserFS.FileSystem.ZipFS(new Buffer(d)));
//     mfs.mount('/home', new BrowserFS.FileSystem.InMemory());
//     mfs.mount('/tmp', new BrowserFS.FileSystem.InMemory());
//     BrowserFS.initialize(mfs);

//     copyDir('/zip_home', '/home');
  
//     fs.writeFile("/tmp/Main.java", `class Main {
//   public static void main(String[] args) {
//     System.out.println("Hello world!");
//   }
// }`);

//     console.log("running JVM");
//     Doppio.VM.CLI(
//       ['/home/Javac', '/tmp/Main.java'],
//       {doppioHomePath: '/home'}, 
//       exitCode => {
//         if (exitCode === 0)
//           Doppio.VM.CLI(['/tmp/Main'],{doppioHomePath: '/home'});
//       });
//     });
