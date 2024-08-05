import { FC, ReactNode } from "react";
import { List } from "../../compound-components";
import { Pagination } from "../pagination";
import { ComponentLoader } from "../loader";

type Props = {
  currentPage: number;
  isLoading: boolean;
  paginationRange: number[];
  handlePaging: (page: number) => void;
  renderItemList: () => ReactNode;
};

/**
 * List item component with pagination support
 * @param props `{currentPage, isLoading, paginationRange, handlePaging, renderItemList}`
 * @returns React component
 */
const ListWithPagination: FC<Props> = (props) => {
  /** Show loader */
  if (props.isLoading) {
    return <ComponentLoader />;
  }

  return (
    <>
      {/* render list of item */}
      <List.Wrapper>{props.renderItemList()}</List.Wrapper>
      {/* pagination */}
      <>
        <Pagination
          paginationRange={props.paginationRange}
          currentPage={props.currentPage}
          handlePaging={props.handlePaging}
        />
      </>
    </>
  );
};

export default ListWithPagination;
