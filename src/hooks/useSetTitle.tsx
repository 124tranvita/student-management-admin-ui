import { useEffect } from "react";

const useSetTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

export default useSetTitle;
