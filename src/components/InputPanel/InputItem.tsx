import React, { PropsWithChildren, useCallback } from 'react';
import styles from '../../css/RMLMappingEditor.module.scss';

interface InputItemProps extends PropsWithChildren {
  onClick: (index: number) => void;
  index: number;
}

function InputItem({ onClick, index, children }: InputItemProps) {
  const handleClick = useCallback(() => {
    onClick(index);
  }, [index, onClick]);
  return (
    <div className={styles.inputItem} onClick={handleClick}>
      {children}
    </div>
  );
}

export default InputItem;
