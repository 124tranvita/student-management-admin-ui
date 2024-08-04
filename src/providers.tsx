import { ReactNode } from "react";
import { EventManagementProvider } from "./context/EventManagementContext";
import { SearchQueryProvider } from "./context/SearchQueryContext";
import { SelectIdProvider } from "./context/SelectIdContext";
import { AuthContextProvider } from "./context/AuthContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthContextProvider>
      <EventManagementProvider>
        <SelectIdProvider>
          <SearchQueryProvider>{children}</SearchQueryProvider>
        </SelectIdProvider>
      </EventManagementProvider>
    </AuthContextProvider>
  );
}
