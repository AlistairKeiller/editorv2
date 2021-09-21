import { Doc } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import * as monaco from 'monaco-editor';

const ydoc = new Doc();
const provider = new WebrtcProvider(window.location.pathname, ydoc);

const editor = monaco.editor.create(document.getElementById('monaco-editor'), {
  language: 'java',
  theme: 'vs-dark',
  automaticLayout: true,
  wordWrap: 'on',
  minimap: {
    enabled: false
  },
  scrollbar: {
    vertical: 'auto'
   }
});

const monacoBinding = new MonacoBinding(
  ydoc.getText(),
  editor.getModel(),
  new Set([editor]),
  provider.awareness
);
