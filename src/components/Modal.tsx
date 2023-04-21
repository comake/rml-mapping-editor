import { ReactNode } from 'react';
import { OrArray } from '../util/TypeUtil';
import CloseButton from './CloseButton';
import styles from '../css/RMLMappingEditor.module.scss';

export interface ModalProps {
  children: OrArray<ReactNode>;
  header: string;
  additionalClasses?: string;
  close?: () => void;
}

function Modal({ children, header, additionalClasses, close }: ModalProps) {
  return (
    <div className={`${styles.modal} ${additionalClasses}`}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderText}>{header}</div>
          { close && <CloseButton onClick={close} /> }
        </div>
        { children }
      </div>
    </div>
  )
}

export default Modal;