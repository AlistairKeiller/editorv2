import './style.css';
import { Doc } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import { editor } from 'monaco-editor';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

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
  ),
  term = new Terminal({
    fontFamily: '"Cascadia Code", Menlo, monospace',
    theme: { background: '#1e1e1e' },
    cursorBlink: true,
  }),
  fitAddon = new FitAddon();

term.loadAddon(fitAddon);
term.open(document.getElementById('terminal'));
fitAddon.fit();

const worker = new Worker(new URL('./worker.js', import.meta.url)), button = document.getElementById('loadButton');

worker.onmessage = (e) => {
  switch (e.data[0]) {
    case 'changeButton':
      button.id = e.data[1];
      break;
    case 'out':
      var split = e.data[1].split('\u000A');
      for (var i = 0; i < split.length - 1; i++) term.writeln(split[i]);
      term.write(split[split.length - 1]);
      break;
    default:
      console.log('default in main from: ' + e.data);
  };
};


var command = '';
term.onData((e) => {
  switch (e) {
    case '\r': // Enter
      term.writeln('');
      worker.postMessage(['in', command]);
      command = '';
      break;
    case '': // Backspace (DEL)
      if (command.length > 0) {
        term.write('\b \b');
        command = command.substr(0, command.length - 1);
      }
      break;
    default: // all other visible characters
      if (e >= ' ' && e <= '~') {
        term.write(e);
        command += e;
      }
  }
});

button.onclick = () => {
  if (button.id == 'runButton' && mEditor.getValue() !== '') {
    button.id = 'compilingButton';
    term.reset();
    command = '';
    worker.postMessage(['compileAndRun', mEditor.getValue()]);
  }
};
