import './style.css';
import { Doc } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import { editor } from 'monaco-editor';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { VM } from 'doppiojvm';

const ydoc = new Doc(),
  provider = new WebrtcProvider(window.location.pathname, ydoc),
  mEditor = editor.create(document.getElementById('monaco-editor'), {
    language: 'java',
    theme: 'vs-dark',
    minimap: {
      enabled: false,
    },
  }),
  monacoBinding = new MonacoBinding(
    ydoc.getText(),
    mEditor.getModel(),
    new Set([mEditor]),
    provider.awareness
  );

const term = new Terminal({
    fontFamily: '"Cascadia Code", Menlo, monospace',
    theme: { background: '#1e1e1e' },
    cursorBlink: true,
  }),
  fitAddon = new FitAddon();
term.loadAddon(fitAddon);
term.open(document.getElementById('terminal'));
fitAddon.fit();

fetch('doppio.zip')
  .then((d) => d.arrayBuffer())
  .then((d) => {
    const fs = BrowserFS.BFSRequire('fs'),
      path = BrowserFS.BFSRequire('path'),
      Buffer = BrowserFS.BFSRequire('buffer').Buffer,
      process = BrowserFS.BFSRequire('process');

    function copyDir(src, dest) {
      fs.mkdir(dest, (e) => {
        fs.readdir(src, (e, files) => {
          files.forEach((file) => {
            var srcFile = path.resolve(src, file),
              destFile = path.resolve(dest, file);
            fs.stat(srcFile, (e, stat) => {
              stat.isDirectory()
                ? copyDir(srcFile, destFile)
                : fs.readFile(srcFile, (e, data) => {
                    fs.writeFile(destFile, data);
                  });
            });
          });
        });
      });
    }

    var mfs = new BrowserFS.FileSystem.MountableFileSystem();
    mfs.mount('/zip', new BrowserFS.FileSystem.ZipFS(new Buffer(d)));
    mfs.mount('/home', new BrowserFS.FileSystem.InMemory());
    mfs.mount('/tmp', new BrowserFS.FileSystem.InMemory());
    BrowserFS.initialize(mfs);
    copyDir('/zip', '/home');

    var button = document.getElementById('loadButton'),
      command = '';
    button.id = 'runButton';
    button.onclick = () => {
      if (button.id == 'runButton') {
        button.id = 'compilingButton';
        term.reset();
        command = '';
        fs.writeFile('/tmp/Main.java', mEditor.getValue(), () => {
          VM.CLI(
            ['/home/Javac', '/tmp/Main.java'],
            { doppioHomePath: '/home' },
            () => {
              fs.readFile('/tmp/Main.class', (e) => {
                if (e) button.id = 'runButton';
                else {
                  fs.readFile('/tmp/Change.class', (e, d) => {
                    console.log(d);
                  });
                  button.id = 'runningButton';
                  VM.CLI(['/tmp/Main'], { doppioHomePath: '/home' }, () => {
                    fs.unlink('/tmp/Main.class', () => {
                      button.id = 'runButton';
                    });
                  });
                }
              });
            }
          );
        });
      }
    };
    process.initializeTTYs();
    process.stdout.on('data', (d) => {
      var split = d.toString().split('\u000A');
      for (var i = 0; i < split.length - 1; i++) term.writeln(split[i]);
      term.write(split[split.length - 1]);
    });
    process.stderr.on('data', (d) => {
      var split = d.toString().split('\u000A');
      for (var i = 0; i < split.length - 1; i++) term.writeln(split[i]);
      term.write(split[split.length - 1]);
    });
    term.onData((e) => {
      switch (e) {
        case '\r': // Enter
          process.stdin.write(command + '\n');
          command = '';
          term.writeln('');
          break;
        case '\u007F': // Backspace (DEL)
          if (command.length > 0) {
            term.write('\b \b');
            command = command.substr(0, command.length - 1);
          }
          break;
        default:
          // Print all other characters for demo
          if (
            e >= String.fromCharCode(0x20) &&
            e <= String.fromCharCode(0x7b)
          ) {
            command += e;
            term.write(e);
          }
      }
    });
  });
