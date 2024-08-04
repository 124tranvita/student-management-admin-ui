import { useRef, useCallback } from "react";

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => i + start);
};

/**
 *usePagination custom hook:
 * 1. Use `setGrossCnt()` to set the gross count.
 * 2. Use `setPaginationRange()` to generate the pagination array.
 * @param limit Limit item per page
 * @returns  `{setPaginationRange, setGrossCnt, setLimit}`
 */
const usePagination = (limit: number) => {
  const grossCntRef = useRef<number>(0);
  const limitRef = useRef<number>(limit);
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

  return { setPaginationRange, setGrossCnt };
};

export default usePagination;
