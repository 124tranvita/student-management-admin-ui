import { FC, useEffect, useState } from "react";
import { useSearchQuery } from "../../../hooks/useSearchQuery";

type Props = {
  setEventId: (value: string) => void;
  disabled?: boolean;
};

const SearchInput: FC<Props> = ({ setEventId, disabled = false }) => {
  const [value, setValue] = useState<string>("");
  const { handleSearch } = useSearchQuery(setEventId);

  useEffect(() => {
    handleSearch(value);
  }, [handleSearch, value]);

  return (
    <>
      <div className="relative p-2 rounded-md bg-slate-100 outline-1 outline-slate-200">
        <div className="absolute top-3 right-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#64748b"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </div>
        <input
          className="bg-slate-100 w-[300px] pr-[24px] outline-none"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value as string)}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default SearchInput;
