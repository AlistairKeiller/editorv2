import { Doc } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import { editor } from 'monaco-editor';
import * as BrowserFS from 'browserfs';
import * as Doppio from 'doppiojvm';
import 'core-js';

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

fetch('doppio_home.zip')
  .then((r) => r.arrayBuffer())
  .then((d) => {
    BrowserFS.configure({
      fs: "MountableFileSystem",
      options: {
        "/home": {
          fs: "ZipFS",
          options: {
            zipData: BrowserFS.BFSRequire('buffer').Buffer.from(d)
          }
        },
        "/tmp": { fs: "InMemory" }
      }
    });
    new Doppio.VM.JVM({doppioHomePath: '/home'});
  });
