import { Doc } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import { editor } from 'monaco-editor';
import setimmediate;
import * as Doppio from 'doppiojvm';

const ydoc = new Doc(),
provider = new WebrtcProvider(window.location.pathname, ydoc),
mEditor = editor.create(document.getElementById('monaco-editor'), {
  language: 'java',
  theme: 'vs-dark',
  automaticLayout: true,
  wordWrap: 'on',
  minimap: {
    enabled: false
  }
}),
monacoBinding = new MonacoBinding(
  ydoc.getText(),
  mEditor.getModel(),
  new Set([mEditor]),
  provider.awareness
);

BrowserFS.FileSystem.XmlHttpRequest.FromURL('listings.json', (e, fs) => {
  var mfs = new BrowserFS.FileSystem.MountableFileSystem();
  mfs.mount('/home', fs);
  mfs.mount('/tmp', new BrowserFS.FileSystem.InMemory());
  BrowserFS.initialize(mfs);
  
  var button = document.getElementById('loadButton');
    button.id = 'runButton';
    button.onclick = () => {
      if (button.id === 'runButton'){
        button.id = 'runningButton';
        fs.writeFile('/tmp/Main.java', mEditor.getValue());
        Doppio.VM.CLI(
          ['/home/Javac', '/tmp/Main.java'],
          {doppioHomePath: '/home'}, 
          e => {
            if (e === 0)
              Doppio.VM.CLI(
                ['/tmp/Main'],
                {doppioHomePath: '/home'},
                () => {button.id = 'runButton';}
              );
        });
      }
    }
});
