import { VM } from 'doppiojvm';
const fs = BrowserFS.BFSRequire('fs'),
  path = BrowserFS.BFSRequire('path'),
  Buffer = BrowserFS.BFSRequire('buffer').Buffer,
  process = BrowserFS.BFSRequire('process');
var mfs;

function copyDir(src, dest) {
  fs.mkdir(dest, (e) => {
    fs.readdir(src, (e, files) => {
      files.forEach((file) => {
        var srcFile = path.resolve(src, file),
          destFile = path.resolve(dest, file);
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

onmessage = (e) => {
  switch (e.data[0]) {
    case 'setup':
      console.log('setup')
      fetch('doppio.zip')
        .then((d) => d.arrayBuffer())
        .then((d) => {
          mfs = new BrowserFS.FileSystem.MountableFileSystem();
          mfs.mount('/zip', new BrowserFS.FileSystem.ZipFS(new Buffer(d)));
          mfs.mount('/home', new BrowserFS.FileSystem.InMemory());
          mfs.mount('/tmp', new BrowserFS.FileSystem.InMemory());
          BrowserFS.initialize(mfs);
          copyDir('/zip', '/home');
          mfs.umount('/zip');
          postMessage(['changeToRunButton']);
        });
      break;
    case 'stdin':
      console.log(e.data[1]);
      break;
    default:
      console.log('default in worker from: ' + e.data);
  };
};
