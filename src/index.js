import { Doc } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import {editor} from 'monaco-editor';

const ydoc = new Doc();
const provider = new WebrtcProvider(window.location.pathname, ydoc);

const e = editor.create(document.getElementById('monaco-editor'), {
  value: '',
  language: 'java',
  theme: 'vs-dark',
});

const monacoBinding = new MonacoBinding(
  ydoc.getText(),
  e.getModel(),
  new Set([e]),
  provider.awareness
);
