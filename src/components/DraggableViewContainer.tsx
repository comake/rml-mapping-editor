import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FixedLengthArray } from "../util/TypeUtil";
import DraggableViewSection from "./DraggableViewSection";
import styles from "../css/RMLMappingEditor.module.scss";
import useWindowEvent from "../hooks/useWindowEvent";

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
      if (collapsedIndices.includes(index) || dim === undefined) return sum;
      if (dim === 0 && !collapsedIndices.includes(index))
        return sum + MINIMUM_DIMENSION;
      return sum + dim;
    }, 0);

    const leftoverSpace = (totalContainerDimension ?? 0) - usedDimensions;
    const leftoverCount = dimensions.filter(
      (dim, index) => dim === undefined || collapsedIndices.includes(index)
    ).length;

    const newDimensions = dimensions.map((dim, index) => {
      if (collapsedIndices.includes(index)) return 0;
      if (dim === 0 && !collapsedIndices.includes(index))
        return MINIMUM_DIMENSION;
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
      let collapsedItemsSpace = 0;
      // Space occupied by items that were previously collapsed and have now been opened
      let uncollapsedItemsSpace = 0;
      let openItemsCount = 0;
      dimensions.forEach((dim, index) => {
        if (collapsedIndices.includes(index) && dim !== undefined && dim > 0) {
          collapsedItemsSpace += dim;
        } else if (
          !collapsedIndices.includes(index) &&
          dim !== undefined &&
          dim === 0
        ) {
          uncollapsedItemsSpace +=
            defaultViewDimensions[index] ?? MINIMUM_DIMENSION;
        }
        if (!collapsedIndices.includes(index) && (dim === undefined || dim > 0))
          openItemsCount++;
      });

      // uncollapsedItemsCount includes both, the items that just opened and the ones that were open already. openItemsCount only includes the items that were open while some (or none) were collapsed.
      const uncollapsedItemsCount = dimensions.length - collapsedIndices.length;

      const newDimensions = dimensions.map((dim, index) => {
        if (collapsedIndices.includes(index)) return 0;
        if (dim === undefined) {
          console.log("dim is undefined");
          return dim;
        }
        if (dim === 0 && !collapsedIndices.includes(index)) {
          return defaultViewDimensions[index] ?? MINIMUM_DIMENSION;
        }
        const newDim =
          dim +
          (collapsedItemsSpace ?? 0) / (uncollapsedItemsCount ?? 1) -
          uncollapsedItemsSpace / openItemsCount;
        console.log({ newDim  });
        return newDim;
      }) as unknown as FixedLengthArray<number | undefined, T>;
      console.log({
        collapsedItemsSpace,
        newDimensions,
        collapsedIndices,
        uncollapsedItemsCount,
        openItemsCount,
        uncollapsedItemsSpace,
      });
      return newDimensions;
    });
  }, [collapsedIndices, defaultViewDimensions]);

  useEffect(() => {
    handleCollapseChange();
  }, [collapsedIndices, handleCollapseChange]);

  useEffect(() => {
    // console.log({ hasUndefinedDimensions, dimensions });
    if (containerRef.current && hasUndefinedDimensions) {
      updateDimensions();
    }
  }, [hasUndefinedDimensions, updateDimensions]);

  const classes = useMemo(() => {
    return [
      styles.draggableViewContainer,
      vertical ? "vertical" : "horizonatal",
      ...additionalClasses,
    ].join(" ");
  }, [vertical, additionalClasses]);

  const style = useMemo(
    () =>
      hasUndefinedDimensions
        ? ({
            display: "flex",
            flexDirection: vertical ? "column" : "row",
          } as const)
        : ({ position: "relative" } as const),
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
      let canApplyDimensionChange =
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

  useWindowEvent("resize", true, onResize);

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
