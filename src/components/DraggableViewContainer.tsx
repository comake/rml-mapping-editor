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
  collapsedIndices: number[];
}

function DraggableViewContainer<T extends number>({
  viewContent,
  defaultViewDimensions,
  vertical,
  additionalClasses = [],
  collapsedIndices = [],
}: DraggableViewContainerProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [dimensions, setDimensions] = useState<
    FixedLengthArray<number | undefined, T>
  >(defaultViewDimensions);

  const updateDimensions = useCallback(() => {
    const totalContainerDimension = vertical
      ? containerRef.current?.offsetHeight
      : containerRef.current?.offsetWidth;

    const usedDimensions = dimensions.reduce((sum: number, dim, index) => {
      if (collapsedIndices.includes(index) || dim === undefined) {
        return sum;
      }
      if (dim === 0 && !collapsedIndices.includes(index))
        return sum + MINIMUM_DIMENSION;
      return sum + dim;
    }, 0);

    const leftoverSpace = (totalContainerDimension ?? 0) - usedDimensions;
    const leftoverCount = dimensions.filter(
      (dim, index) => dim === undefined
    ).length;

    const newDimensions = dimensions.map((dim, index) => {
      if (collapsedIndices.includes(index)) {
        return 0;
      }
      if (dim === 0 && !collapsedIndices.includes(index)) {
        return MINIMUM_DIMENSION;
      }
      return dim === undefined ? leftoverSpace / leftoverCount : dim;
    }) as unknown as FixedLengthArray<number, T>;

    setDimensions(newDimensions);
  }, [vertical, dimensions, collapsedIndices]);

  const hasUndefinedDimensions = useMemo(
    () => dimensions.some((dim) => dim === undefined),
    [dimensions]
  );

  const handleCollapseChange = useCallback(() => {
    setDimensions((dimensions) => {
      // Space occupied by items that were previously collapsed and have now been opened
      const uncollapsedDims: { index: number; dim: number }[] = [];
      const collapsedDims: { index: number; dim: number }[] = [];
      dimensions.forEach((dim, index) => {
        if (collapsedIndices.includes(index) && dim !== undefined && dim > 0) {
          collapsedDims.push({ index, dim: dim ?? 0 });
        } else if (!collapsedIndices.includes(index) && dim === 0) {
          uncollapsedDims.push({
            index,
            dim: defaultViewDimensions[index] ?? MINIMUM_DIMENSION,
          });
        }
      });

      // uncollapsedItemsCount includes both, the items that just opened and the ones that were open already. openItemsCount only includes the items that were open while some (or none) were collapsed.
      // const uncollapsedItemsCount = dimensions.length - collapsedIndices.length;
      let remToReduce = 0;
      const frozenDimIndices: number[] = [];
      let newDimensions = dimensions.map((dim, index) => {
        if (collapsedIndices.includes(index)) {
          return 0;
        }
        if (dim === undefined) {
          return dim;
        }
        if (dim === 0 && !collapsedIndices.includes(index)) {
          return defaultViewDimensions[index] ?? MINIMUM_DIMENSION;
        }
        let toReduce = remToReduce,
          toAdd = 0;
        const nextUncollapsed = uncollapsedDims.find(
          (uncollapsed) => uncollapsed.index - 1 === index
        );
        const nextCollapsed = collapsedDims.find(
          (collapsed) => collapsed.index - 1 === index
        );

        if (nextUncollapsed) {
          // Make sure the panel being shrunk is at least MINIMUM_DIMENSION in width
          if (nextUncollapsed.dim + remToReduce <= dim - MINIMUM_DIMENSION) {
            toReduce += nextUncollapsed.dim;
          } else {
            remToReduce += MINIMUM_DIMENSION;
            toReduce = dim - MINIMUM_DIMENSION;
            frozenDimIndices.push(index);
          }
        } else if (nextCollapsed) {
          toAdd += nextCollapsed.dim;
        }

        const newDim = dim + toAdd - toReduce;
        return newDim;
      }) as unknown as FixedLengthArray<number | undefined, T>;
      if (remToReduce) {
        const reduceFromCount = dimensions.length - frozenDimIndices.length;
        newDimensions = newDimensions.map((dim, index) =>
          typeof dim === 'number' && !frozenDimIndices.includes(index)
            ? dim - remToReduce / reduceFromCount
            : dim
        ) as unknown as FixedLengthArray<number | undefined, T>;
      }
      return newDimensions;
    });
  }, [collapsedIndices, defaultViewDimensions]);

  useEffect(() => {
    handleCollapseChange();
  }, [collapsedIndices, handleCollapseChange]);

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
      return dimensions.slice(0, index).reduce((sum: number, dim) => {
        if (collapsedIndices.includes(index - 1)) {
          return sum;
        }
        return sum + (dim ?? 0);
      }, 0);
    });
  }, [dimensions, collapsedIndices]);

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
        if (oldDimension !== undefined && !collapsedIndices.includes(index)) {
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
        !collapsedIndices.includes(index)
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
  }, [defaultViewDimensions, dimensions, vertical, collapsedIndices]);

  const onResize = useCallback(() => {
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }

    resizeTimeout.current = setTimeout(recalcWidths, RESIZE_TIMEOUT_DURATION);
  }, [recalcWidths]);

  useWindowEvent('resize', true, onResize);

  return (
    <div ref={containerRef} className={classes} style={style}>
      {viewContent.map((content, index) => (
        <DraggableViewSection
          key={index}
          onDimensionChange={handleDimensionChange.bind(null, index)}
          dimensionsComputed={!hasUndefinedDimensions}
          offset={offsets[index]}
          dimension={dimensions[index]}
          vertical={vertical}
          isLast={index === viewContent.length - 1}
        >
          {content}
        </DraggableViewSection>
      ))}
    </div>
  );
}

export default DraggableViewContainer;
