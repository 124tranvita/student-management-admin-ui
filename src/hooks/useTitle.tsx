import { useEffect, useState } from "react";

const useTitle = () => {
  const [title, setTitle] = useState("");
  useEffect(() => {
    document.title = title;
  }, [title]);

  return { setTitle };
};

export default useTitle;
