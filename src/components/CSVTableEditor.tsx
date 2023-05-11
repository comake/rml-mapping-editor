import React, {
  ChangeEvent,
  MouseEvent as RMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../css/RMLMappingEditor.module.scss';

interface CSVTableEditorProps {
  content: string;
  onContentChange: (newContent: string) => void;
}

function CSVTableEditor({ content, onContentChange }: CSVTableEditorProps) {
  const table = useMemo(() => stringToTable(content), [content]);

  const [editingCell, setEditingCell] = useState<
    [number, number] | undefined
  >();
  const [activeInput, setActiveInput] = useState<null | HTMLInputElement>(null);

  const tableRef = useRef<HTMLTableElement | null>(null);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const tableDims = tableRef.current?.getBoundingClientRect();
      if (
        tableDims &&
        (e.clientX > tableDims.x + tableDims.width ||
          e.clientY > tableDims.y + tableDims.height)
      ) {
        setEditingCell(undefined);
      }
    },
    [setEditingCell]
  );

  useEffect(() => {
    if (activeInput) activeInput.focus();
  }, [activeInput]);

  useEffect(() => {
    onContentChange(table.map((row) => row.join(',')).join('\n'));
  }, [onContentChange, table]);

  useEffect(() => {
    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleTdClick = useCallback(
    (e: RMouseEvent<HTMLTableCellElement>) => {
      const [row, col] = [
        parseInt(e.currentTarget.dataset.rowIndex ?? '', 10),
        parseInt(e.currentTarget.dataset.colIndex ?? '', 10),
      ];
      setEditingCell([row, col]);
    },
    [setEditingCell]
  );

  const handleCellValueChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const [row, col] = [
        parseInt(e.currentTarget.dataset.rowIndex ?? '', 10),
        parseInt(e.currentTarget.dataset.colIndex ?? '', 10),
      ];
      const value = e.currentTarget.value;
      const newTable = [...table];
      newTable[row][col] = parseRawValue(value);
      onContentChange(tableToString(newTable));
    },
    [onContentChange, table]
  );

  const removeRow = useCallback(
    (e: RMouseEvent<HTMLButtonElement>) => {
      const rowIndex = parseInt(e.currentTarget.dataset.rowIndex || '', 10);

      const newTable = [...table];
      newTable.splice(rowIndex, 1);
      onContentChange(tableToString(newTable));
    },
    [onContentChange, table]
  );

  const addRow = useCallback(() => {
    const columnCount = table[0].length;
    const newRow = [];
    for (let i = 0; i < columnCount; i++) {
      newRow.push('');
    }
    onContentChange(tableToString([...table, newRow]));
  }, [onContentChange, table]);

  const addColumn = useCallback(() => {
    const newTable = [...table];
    for (let i = 0; i < newTable.length; ++i) {
      newTable[i].push('');
    }
    onContentChange(tableToString(newTable));
  }, [onContentChange, table]);

  return (
    <>
      <table ref={tableRef} className={styles.csvEditorTable}>
        <thead>
          <tr>
            {table[0].map((cellContent, index) => (
              <td
                data-row-index={0}
                data-col-index={index}
                onClick={handleTdClick}
                className={`${styles.cell} ${styles.tableheader}`}
                key={index}
              >
                {editingCell &&
                editingCell[0] === 0 &&
                editingCell[1] === index ? (
                  <input
                    className={styles.tableItemInput}
                    data-row-index={0}
                    data-col-index={index}
                    value={parseCellValue(cellContent)}
                    onChange={handleCellValueChange}
                  />
                ) : (
                  parseCellValue(cellContent)
                )}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cellContent, colIndex) => {
                const correctedRowIndex = rowIndex + 1;
                return (
                  <td
                    className={styles.cell}
                    key={colIndex}
                    data-row-index={correctedRowIndex}
                    data-col-index={colIndex}
                    onClick={handleTdClick}
                  >
                    {editingCell &&
                    editingCell[0] === correctedRowIndex &&
                    editingCell[1] === colIndex ? (
                      <input
                        className={styles.tableItemInput}
                        ref={(ref) => setActiveInput(ref)}
                        data-row-index={correctedRowIndex}
                        data-col-index={colIndex}
                        value={parseCellValue(cellContent)}
                        onChange={handleCellValueChange}
                      />
                    ) : (
                      parseCellValue(cellContent)
                    )}
                  </td>
                );
              })}
              <td className={styles.actionsCell}>
                <span className={styles.tableActionsContainer}>
                  <button
                    data-row-index={rowIndex + 1}
                    onClick={removeRow}
                    className={styles.addTableItem}
                  >
                    {' '}
                    -{' '}
                  </button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.addTableItemContainer}>
        <button className={styles.addTableItem} onClick={addRow}>
          {' '}
          + Row
        </button>
        <button className={styles.addTableItem} onClick={addColumn}>
          {' '}
          + Column
        </button>
      </div>
    </>
  );
}

export default CSVTableEditor;

const stringToTable = (content: string) => {
  return content.split('\n').map((row) => {
    const items = [''];
    row.split('').forEach((char, index) => {
      if (char === ',' && row[index - 1] !== '\\') {
        items.push('');
        return;
      }
      items[items.length - 1] += char;
    });
    return items;
  });
};

const parseCellValue = (cellContent: string) => {
  return cellContent.replace(/\\,/g, ',');
};

const parseRawValue = (value: string) => {
  let parsedValue = '';
  if (value) {
    parsedValue = value.replace(/,/g, '\\,');
  }
  return parsedValue ?? '';
};

const tableToString = (table: string[][]) =>
  table.map((row) => row.join(',')).join('\n');
