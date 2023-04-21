import { ReactComponent as CloseIcon } from '../images/close.svg';
import { ClickEvent } from '../util/TypeUtil';
import styles from '../css/RMLMappingEditor.module.scss';

export interface CloseButtonProps {
  label?: string;
  onClick: (event: ClickEvent) => void;
}

function CloseButton({ onClick, label }: CloseButtonProps) {
  return (
    <button className={styles.closeButton} onClick={onClick}>
      <CloseIcon className={styles.closeIcon} />
      {label}
    </button>
  )
}

export default CloseButton;