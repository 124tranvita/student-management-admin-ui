import { useRef, useCallback } from "react";

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => i + start);
};

/**
 *usePagination custom hook:
 * 1. Use `setGrossCnt()` to set the gross count.
 * 2. Use `setLimit()` to set the limit.
 * 3. Use `setPaginationRange()` to generate the pagination array.
 * @returns  `{setPaginationRange, setGrossCnt, setLimit}`
 */
const usePagination = () => {
  const grossCntRef = useRef<number>(0);
  const limitRef = useRef<number>(0);
  const totalRef = useRef<number>(0);

  /**
   * Generate the pagnination array.
   */
  const setPaginationRange = useCallback(() => {
    if (grossCntRef.current > 0) {
      totalRef.current = Math.ceil(grossCntRef.current / limitRef.current);
    }

    return range(1, totalRef.current);
  }, []);

  /**
   * Set gross count
   * @param - count
   */
  const setGrossCnt = useCallback((count: number) => {
    if (grossCntRef.current === count) return;

    grossCntRef.current = count;
  }, []);

  /**
   * Set limit
   * @param - limit
   */
  const setLimit = useCallback((limit: number) => {
    if (limitRef.current === limit) return;

    limitRef.current = limit;
  }, []);

  return { setPaginationRange, setGrossCnt, setLimit };
};

export default usePagination;
