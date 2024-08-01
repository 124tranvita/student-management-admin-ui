import { useContext } from "react";
import { SelectIdContext } from "../context/SelectIdContext";

export const useSelectId = () => {
  const context = useContext(SelectIdContext);

  if (!context) {
    throw new Error("useSelectId must be used inside the SelectIdContext");
  }

  return context;
};
