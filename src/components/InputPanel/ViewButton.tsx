import React, { PropsWithChildren, useCallback } from 'react';
import { ViewType } from '../../util/TypeUtil';
import styles from '../../css/RMLMappingEditor.module.scss';

interface ViewButtonProps extends PropsWithChildren {
  name: ViewType;
  onClick: (name: ViewType) => void;
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
