import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RMLMappingEditor } from '../src';
import './index.css'

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RMLMappingEditor />
    </React.StrictMode>
  );
}
