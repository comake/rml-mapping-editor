import React, { PropsWithChildren, useCallback } from 'react';
import { InputViewType } from '../../util/TypeUtil';
import styles from '../../css/RMLMappingEditor.module.scss';

interface ViewButtonProps extends PropsWithChildren {
  name: InputViewType;
  onClick: (name: InputViewType) => void;
  isSelected: boolean;
}

function ViewButton({ name, onClick, isSelected, children }: ViewButtonProps) {
  const handleClick = useCallback(() => {
    onClick(name);
  }, [onClick, name]);

  return (
    <button
      className={`${styles.headerButton} ${
        isSelected ? styles.headerButtonSelected : ''
      }`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default ViewButton;
