import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FixedLengthArray } from '../util/TypeUtil';
import DraggableViewSection from './DraggableViewSection';

const MINIMUM_DIMENSION = 130;

export interface DraggableViewContainerProps<T extends number> {
  viewContent: FixedLengthArray<ReactNode, T>;
  defaultViewDimensions: FixedLengthArray<number | undefined, T>;
  vertical?: boolean;
  additionalClasses?: string[],
}

function DraggableViewContainer<T extends number>({ 
  viewContent,
  defaultViewDimensions,
  vertical, 
  additionalClasses = [],
}: DraggableViewContainerProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<FixedLengthArray<number | undefined, T>>(defaultViewDimensions);

  const updateDimensions = useCallback(() => {
    const totalContainerDimension = vertical
      ? containerRef.current!.offsetHeight
      : containerRef.current!.offsetWidth;

    const usedDimensions = dimensions.reduce((sum: number, dim) => (dim !== undefined ? sum + dim : sum), 0);
    const leftoverSpace = totalContainerDimension - usedDimensions;
    const leftoverCount = dimensions.filter(dim => dim === undefined).length;
    const newDimensions = dimensions.map(dim => {
      return dim === undefined ? leftoverSpace / leftoverCount : dim;
    }) as unknown as FixedLengthArray<number, T>;
    
    setDimensions(newDimensions);
  }, [dimensions, vertical]);

  const hasUndefinedDimensions = useMemo(() => dimensions.some(dim => dim === undefined), [dimensions]);

  useEffect(() => {
    if (hasUndefinedDimensions && containerRef.current) {
      updateDimensions();
    }
  }, [hasUndefinedDimensions, updateDimensions]);

  const classes = useMemo(() => {
    return [
      'Draggable-View-Container', 
      vertical ? 'vertical' : 'horizonatal', 
      ...additionalClasses
    ].join(' ')
  }, [vertical, additionalClasses]);

  const style = useMemo(() => (
    hasUndefinedDimensions 
      ? {
          display: 'flex', 
          flexDirection: vertical ? 'column' : 'row'
        } as const
      : { position: 'relative' } as const
  ), [hasUndefinedDimensions, vertical]);

  const offsets = useMemo(() => {
    return dimensions.map((dim, index) => {
      return dimensions.slice(0, index).reduce((sum: number, dim) => sum + (dim ?? 0), 0);
    })
  }, [dimensions]);

  const handleDimensionChange = useCallback((changedIndex: number, dimensionChange: number) => {
    let canApplyDimensionChange = (dimensions[changedIndex] ?? 0) + dimensionChange > MINIMUM_DIMENSION &&
      (dimensions[changedIndex + 1] ?? 0) - dimensionChange > MINIMUM_DIMENSION
    if (canApplyDimensionChange) {
      setDimensions((dimensions) => dimensions.map((dim: number | undefined, index) => {
        if (index === changedIndex) {
          return (dim ?? 0) + dimensionChange;
        } else if (index === changedIndex + 1) {
          return (dim ?? 0) - dimensionChange;
        }
        return dim;
      }) as unknown as FixedLengthArray<number | undefined, T>);
    }
  }, [dimensions]);

  return (
    <div 
      ref={containerRef}
      className={classes}
      style={style}
    >
      { viewContent.map((content, index) => (
        <DraggableViewSection 
          key={index}
          onDimensionChange={handleDimensionChange.bind(null, index)}
          dimensionsComputed={!hasUndefinedDimensions}
          offset={offsets[index]} 
          dimension={dimensions[index]} 
          vertical={vertical}
          isLast={index === viewContent.length - 1}
        >
          { content }
        </DraggableViewSection>
      ))}
    </div>
  );
}

export default DraggableViewContainer;