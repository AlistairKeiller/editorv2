import { Doc } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import { editor } from 'monaco-editor';
import * as BrowserFS from 'browserfs';

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

BrowserFS.configure({
    fs: "MountableFileSystem",
    options: {
      "/zip": {
        fs: "ZipFS",
        options: {
          // Wrap as Buffer object.
          zipData: Buffer.from(zipData)
        }
      },
      "/tmp": { fs: "InMemory" },
      "/home": { fs: "IndexedDB" }
    }
  }, function(e) {
    if (e) {
      // An error occurred.
      throw e;
    }
    // Otherwise, BrowserFS is ready to use!
  });
