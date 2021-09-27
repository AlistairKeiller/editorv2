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

fetch('doppio.zip').then(function(response) {
  return response.arrayBuffer();
}).then(function(zipData) {
  BrowserFS.configure({
    fs: "MountableFileSystem",
    options: {
      "/sys": {
        fs: "ZipFS",
        options: {
          zipData: BrowserFS.BFSRequire('buffer').Buffer.from(zipData)
        }
      },
      "/home": { fs: "InMemory" }
    }
  }, function(e) {
    if (e)
      throw e;
  });
});

new Doppio.VM.JVM({
  doppioHomePath: '/sys'
}, function(err, jvmObject) {});
