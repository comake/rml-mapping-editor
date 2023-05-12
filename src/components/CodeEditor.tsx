import { useRef, useEffect, useContext, useMemo } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { xml } from '@codemirror/lang-xml';
import { githubLight } from "@uiw/codemirror-theme-github";
import { oneDark } from '@codemirror/theme-one-dark';
import { linter, lintGutter } from '@codemirror/lint';
import ThemeContext, { THEMES } from '../contexts/ThemeContext';
import { INPUT_TYPES } from '../util/Constants';
import { InputType } from '../util/TypeUtil';

export type CodeEditorProps = {
  code?: string;
  locked?: boolean;
  classes?: string;
  onChange?: (doc: string) => void;
  hideLineNumbers?: boolean;
  alwaysShowFolds?: boolean;
  mode?: InputType;
  disableLinting?: boolean;
}

function CodeEditor({ 
  code,
  onChange, 
  locked, 
  classes, 
  hideLineNumbers, 
  alwaysShowFolds, 
  disableLinting,
  mode = INPUT_TYPES.json,
}: CodeEditorProps) {
  const { theme } = useContext(ThemeContext);
  const editorRef = useRef<EditorView>();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const themeExtension = useMemo(() => {
    return EditorView.theme({
      "&": { height: "100%" },
      '&.cm-editor.cm-focused': { outline: 'none' },
      '.cm-scroller': { overflow: 'auto' },
      '.cm-gutters': { border: 'none', background: 'none', paddingLeft: hideLineNumbers ? '5px': '' },
      '.cm-gutter.cm-lineNumbers': hideLineNumbers ? { display: 'none !important' } : {},
      '.cm-gutterElement span[title="Fold line"]': alwaysShowFolds ? {} : { visibility: 'hidden' },
      '.cm-gutters:hover .cm-gutterElement span[title="Fold line"]': { visibility: 'visible' },
      '.cm-gutterElement span[title="Unfold line"]': { fontSize: '19px' },
      '.cm-content': { paddingTop: '0px' },
      '.cm-foldGutter span': { top: '-3px', position: 'relative' },
      '.cm-gutter-lint': { position: 'absolute', left: '0px', top: '0px', width: '4px' },
      '.cm-gutter-lint .cm-activeLineGutter': { backgroundColor: 'transparent !important' },
      '.cm-gutter-lint .cm-gutterElement': { padding: '2px 0px' },
      '.cm-gutter-lint .cm-lint-marker-error': {
        content: 'none',
        width: '4px',
        height: '100%',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
      }
    })
  }, [alwaysShowFolds, hideLineNumbers]);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      const extensions = [
        theme === THEMES.light ? githubLight : oneDark,
        basicSetup,
        lintGutter(),
        EditorView.updateListener.of((v) => {
          if (v.docChanged && onChange) {
            onChange(editorRef.current!.state.doc.toString());
          }
        }),
        themeExtension,
        EditorView.editable.of(locked ? false : true),
      ];

      if (mode === INPUT_TYPES.json) {
        extensions.push(json());
        if (!disableLinting) {
          extensions.push(linter(jsonParseLinter()));
        }
      } else if (mode === INPUT_TYPES.xml) {
        extensions.push(xml());
      }

      editorRef.current = new EditorView({
        state: EditorState.create({
          doc: code ?? '',
          extensions,
        }),
        parent: containerRef.current,
      });

      return () => {
        editorRef.current?.destroy()
        editorRef.current = undefined;
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, editorRef, theme, locked, themeExtension, mode]);

  return <div className={classes} ref={containerRef} />;
}

export default CodeEditor;
