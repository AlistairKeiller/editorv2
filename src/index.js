import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import * as monaco from 'monaco-editor';

const ydoc = new Y.Doc();
const provider = new WebrtcProvider(window.location.pathname, ydoc);

const editor = monaco.editor.create(document.getElementById('monaco-editor'), {
  value: '',
  language: 'java',
  theme: 'vs-dark',
});

const monacoBinding = new MonacoBinding(
  ydoc.getText(),
  editor.getModel(),
  new Set([editor]),
  provider.awareness
);
