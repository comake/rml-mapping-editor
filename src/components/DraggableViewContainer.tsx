import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FixedLengthArray } from '../util/TypeUtil';
import DraggableViewSection from './DraggableViewSection';
import styles from '../css/RMLMappingEditor.module.scss';
import useWindowEvent from '../hooks/useWindowEvent';

const RESIZE_TIMEOUT_DURATION = 100;
const MINIMUM_DIMENSION = 130;

export interface DraggableViewContainerProps<T extends number> {
  viewContent: FixedLengthArray<ReactNode, T>;
  defaultViewDimensions: FixedLengthArray<number | undefined, T>;
  vertical?: boolean;
  additionalClasses?: string[];
  collapsedIndicies: number[];
}

function arrayEquals(aArray: any[], bArray: any[]) {
  return aArray.length === bArray.length &&
    aArray.every((val, index) => val === bArray[index]);
}

function DraggableViewContainer<T extends number>({
  viewContent,
  defaultViewDimensions,
  vertical,
  additionalClasses = [],
  collapsedIndicies = [],
}: DraggableViewContainerProps<T>) {
  const [prevCollapsedIndicies, setPrevCollapsedIndicies] = useState<number[]>(collapsedIndicies)
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [dimensions, setDimensions] = useState<
    FixedLengthArray<number | undefined, T>
  >(defaultViewDimensions);

  const updateDimensions = useCallback(() => {
    const totalContainerDimension = vertical
      ? containerRef.current?.offsetHeight
      : containerRef.current?.offsetWidth;

    const usedDimensions = dimensions.reduce((sum: number, dimension, index) => {
      if (collapsedIndicies.includes(index) || dimension === undefined) {
        return sum;
      }
      return sum + Math.max(dimension, MINIMUM_DIMENSION);
    }, 0);

    const leftoverSpace = (totalContainerDimension ?? 0) - usedDimensions;
    const leftoverCount = dimensions
      .filter((dim) => dim === undefined)
      .length;

    const undefinedDimension = Math.max(leftoverSpace / leftoverCount, MINIMUM_DIMENSION);
    const newDimensions = dimensions.map((dimension, index) => {
      if (collapsedIndicies.includes(index)) {
        return defaultViewDimensions[index] ?? MINIMUM_DIMENSION;
      }
      return dimension ?? defaultViewDimensions[index] ?? undefinedDimension;
    }) as unknown as FixedLengthArray<number, T>;

    setDimensions(newDimensions);
  }, [vertical, dimensions, collapsedIndicies, defaultViewDimensions]);

  const hasUndefinedDimensions = useMemo(
    () => dimensions.some((dim) => dim === undefined),
    [dimensions]
  );

  const handleCollapseChange = useCallback(() => {
    const newlyCollapsedIndicies = collapsedIndicies.filter((index) => !prevCollapsedIndicies.includes(index));
    const newwlyUncollapsedIndicies = prevCollapsedIndicies.filter((index) => !collapsedIndicies.includes(index));

    const newDimensions = dimensions.map((dimension, index): number => {
      // Maintain the dimension of collapsed sections so that when they're opened they use the previous dimension
      if (collapsedIndicies.includes(index)) {
        return dimension ?? defaultViewDimensions[index] ?? MINIMUM_DIMENSION;
      }
      if (dimension === undefined) {
        return defaultViewDimensions[index] ?? MINIMUM_DIMENSION;
      }
      if (newwlyUncollapsedIndicies.includes(index - 1)) {
        const prevDimension = dimensions[index - 1] ?? defaultViewDimensions[index - 1] ?? MINIMUM_DIMENSION
        return Math.max(MINIMUM_DIMENSION, dimension - prevDimension);
      } else if (newwlyUncollapsedIndicies.includes(index + 1)) {
        const nextDimension = dimensions[index + 1] ?? defaultViewDimensions[index + 1] ?? MINIMUM_DIMENSION
        return Math.max(MINIMUM_DIMENSION, dimension - nextDimension);
      } if (newlyCollapsedIndicies.includes(index - 1)) {
        const prevDimension = dimensions[index - 1] ?? defaultViewDimensions[index - 1] ?? MINIMUM_DIMENSION
        return dimension + prevDimension;
      } else if (newlyCollapsedIndicies.includes(index + 1)) {
        const nextDimension = dimensions[index + 1] ?? defaultViewDimensions[index + 1] ?? MINIMUM_DIMENSION
        return dimension + nextDimension;
      }
      return dimension;
    }) as unknown as FixedLengthArray<number | undefined, T>;
    setDimensions(newDimensions);
  }, [collapsedIndicies, defaultViewDimensions, dimensions, prevCollapsedIndicies]);

  useEffect(() => {
    if (!arrayEquals(collapsedIndicies, prevCollapsedIndicies)) {
      setPrevCollapsedIndicies(collapsedIndicies);
      handleCollapseChange();
    }
  }, [collapsedIndicies, prevCollapsedIndicies, handleCollapseChange]);

  useEffect(() => {
    if (containerRef.current && hasUndefinedDimensions) {
      updateDimensions();
    }
  }, [hasUndefinedDimensions, updateDimensions]);

  const classes = useMemo(() => {
    return [
      styles.draggableViewContainer,
      vertical ? 'vertical' : 'horizonatal',
      ...additionalClasses,
    ].join(' ');
  }, [vertical, additionalClasses]);

  const style = useMemo(
    () =>
      hasUndefinedDimensions
        ? ({
            display: 'flex',
            flexDirection: vertical ? 'column' : 'row',
          } as const)
        : ({ position: 'relative' } as const),
    [hasUndefinedDimensions, vertical]
  );

  const offsets = useMemo(() => {
    return dimensions.map((dim, index) => {
      return dimensions.slice(0, index).reduce((sum: number, dimension, dimensionIndex) => {
        if (collapsedIndicies.includes(dimensionIndex)) {
          return sum;
        }
        return sum + (dimension ?? 0);
      }, 0);
    });
  }, [dimensions, collapsedIndicies]);

  const handleDimensionChange = useCallback(
    (changedIndex: number, dimensionChange: number) => {
      const canApplyDimensionChange =
        (dimensions[changedIndex] ?? 0) + dimensionChange > MINIMUM_DIMENSION &&
        (dimensions[changedIndex + 1] ?? 0) - dimensionChange >
          MINIMUM_DIMENSION;

      if (canApplyDimensionChange) {
        setDimensions(
          (dimensions) =>
            dimensions.map((dim: number | undefined, index) => {
              if (index === changedIndex) {
                return (dim ?? 0) + dimensionChange;
              } else if (index === changedIndex + 1) {
                return (dim ?? 0) - dimensionChange;
              }
              return dim;
            }) as unknown as FixedLengthArray<number | undefined, T>
        );
      }
    },
    [dimensions]
  );

  const recalcWidths = useCallback(() => {
    const totalContainerDimension = vertical
      ? containerRef.current!.offsetHeight
      : containerRef.current!.offsetWidth;

    const indiciesOfPreferedWidths = defaultViewDimensions.reduce(
      (arr: number[], oldDimension, index) => {
        if (oldDimension !== undefined && !collapsedIndicies.includes(index)) {
          arr.push(index);
        }
        return arr;
      },
      []
    );

    let totalPreferredSpace = 0;
    let totalNonPreferedSpace = 0;
    dimensions.forEach((oldDimension, index) => {
      if (
        indiciesOfPreferedWidths.includes(index) &&
        !collapsedIndicies.includes(index)
      ) {
        totalPreferredSpace += oldDimension ?? 0;
      } else {
        totalNonPreferedSpace += oldDimension ?? 0;
      }
    });

    const totalUnpreferredSpace = totalContainerDimension - totalPreferredSpace;

    const newDimensions = dimensions.map((oldDimension, index) => {
      if (indiciesOfPreferedWidths.includes(index)) {
        return oldDimension;
      } else {
        return (
          Math.abs(totalUnpreferredSpace) *
          ((oldDimension ?? 0) / totalNonPreferedSpace)
        );
      }
    });

    setDimensions(
      newDimensions as unknown as FixedLengthArray<number | undefined, T>
    );
  }, [defaultViewDimensions, dimensions, vertical, collapsedIndicies]);

  const onResize = useCallback(() => {
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }

    resizeTimeout.current = setTimeout(recalcWidths, RESIZE_TIMEOUT_DURATION);
  }, [recalcWidths]);

  useWindowEvent('resize', true, onResize);

  return (
    <div ref={containerRef} className={classes} style={style}>
      {viewContent.map((content, index) => {
        const isCollapsed = collapsedIndicies.includes(index);
        return (
          <DraggableViewSection
            key={index}
            onDimensionChange={handleDimensionChange.bind(null, index)}
            dimensionsComputed={!hasUndefinedDimensions}
            offset={offsets[index]}
            dimension={isCollapsed ? 0 : dimensions[index]}
            vertical={vertical}
            isLast={index === viewContent.length - 1}
          >
            {content}
          </DraggableViewSection>
        )
      })}
    </div>
  );
}

export default DraggableViewContainer;
