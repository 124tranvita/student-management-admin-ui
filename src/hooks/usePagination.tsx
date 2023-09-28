import { useEffect, useMemo, useState } from "react";

type PaginationProps = {
  limit: number;
  grossCnt: number;
};

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => i + start);
};

const usePagination = ({ limit, grossCnt }: PaginationProps) => {
  // const [count, setCount] = useState<number>(
  //   JSON.parse(localStorage.getItem("grossCnt") || "0") || grossCnt
  // );
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (grossCnt > 0) {
      const total = Math.ceil(grossCnt / limit);
      setTotal(total);
    }

    // localStorage.setItem("grossCnt", JSON.stringify(grossCnt));
  }, [grossCnt, limit]);

  const paginationRange = useMemo(() => {
    return range(1, total);
  }, [total]);

  return { paginationRange };
};

export default usePagination;
