import {
  DragEvent,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { OrArray } from '../util/TypeUtil';
import styles from '../css/RMLMappingEditor.module.scss';

const DRAG_HOVER_TIMEOUT_DURATION = 380;

export interface DraggableViewSectionProps {
  children: OrArray<ReactNode>;
  dimensionsComputed: boolean;
  dimension?: number;
  offset?: number;
  vertical?: boolean;
  isLast?: boolean;
  onDimensionChange: (change: number) => void;
}

function DraggableViewSection({
  children,
  offset,
  dimension,
  vertical,
  dimensionsComputed,
  isLast,
  onDimensionChange,
}: DraggableViewSectionProps) {
  const dragEvent = useRef<DragEvent<Body>>();
  const [isDragging, setIsDragging] = useState(false);
  const prevDragPosition = useRef<{ x: number; y: number }>();
  const hoverTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [hasLongHovered, setHasLongHovered] = useState(false);
  const onMouseEnter = useCallback(() => {
    if (!hoverTimeout.current) {
      hoverTimeout.current = setTimeout(
        () => setHasLongHovered(true),
        DRAG_HOVER_TIMEOUT_DURATION
      );
    }
  }, []);

  const dragoverHandler = useCallback((e: DragEvent<Body>) => {
    dragEvent.current = e;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = undefined;
    }
    setHasLongHovered(false);
  }, []);

  const handleDrag = useCallback(
    (_: DragEvent<HTMLDivElement | Body>) => {
      setTimeout(() => {
        if (
          dragEvent &&
          dragEvent.current?.clientX &&
          dragEvent.current?.clientY
        ) {
          if (prevDragPosition.current) {
            const dimensionChange = vertical
              ? (dragEvent.current.clientY ?? 0) - prevDragPosition.current.y
              : (dragEvent.current.clientX ?? 0) - prevDragPosition.current.x;
            onDimensionChange(dimensionChange);
          }
          prevDragPosition.current = {
            x: dragEvent.current.clientX,
            y: dragEvent.current.clientY,
          };
        }
      });
    },
    [onDimensionChange, vertical]
  );

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      setIsDragging(true);
      prevDragPosition.current = { x: event.clientX, y: event.clientY };
      document.body.addEventListener(
        'dragover',
        dragoverHandler as unknown as EventListener
      );
    },
    [dragoverHandler]
  );

  const handleDragEnd = useCallback(() => {
    prevDragPosition.current = undefined;
    setIsDragging(false);
    document.body.removeEventListener(
      'dragover',
      dragoverHandler as unknown as EventListener
    );
    dragEvent.current = undefined;
  }, [dragoverHandler]);

  const style = useMemo(
    () =>
      dimensionsComputed
        ? ({
            position: 'absolute',
            width: vertical ? '100%' : dimension,
            left: vertical ? '0px' : offset,
            height: vertical ? dimension : '100%',
            top: vertical ? offset : '0px',
          } as const)
        : ({
            position: 'relative',
            flex: dimension ? undefined : 1,
            width: vertical ? '100%' : dimension,
            height: vertical ? dimension : '100%',
          } as const),
    [dimensionsComputed, vertical, dimension, offset]
  );

  return (
    <div
      className={`${styles.draggableViewSection} ${
        isDragging ? styles.dragging : ''
      } ${hasLongHovered ? styles.dragHandleLongHover : ''}`}
      style={style}
    >
      {children}
      {!isLast && (
        <div
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={styles.dragHandle}
          draggable="true"
          onDrag={handleDrag}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        ></div>
      )}
    </div>
  );
}

export default DraggableViewSection;
