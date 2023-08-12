import React from "react";
import ReactPaginate from "react-paginate";

function Paginate(props) {
  const { countArticle, limit, handlePageClick } = props;
  return (
    <ReactPaginate
      pageClassName="page-item"
      pageLinkClassName="page-link"
      pageCount={countArticle / limit}
      marginPagesDisplayed={20}
      onPageChange={(e) => handlePageClick(e)}
      containerClassName="pagination"
      activeClassName="active"
    />
  );
}

export default Paginate;
