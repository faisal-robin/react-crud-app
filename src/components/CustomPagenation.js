import React from 'react';
import { Pagination } from 'react-bootstrap';

const CustomPagination = ({ currentPage, itemsPerPage, totalRows, onChange }) => {
    const totalPages = Math.ceil(totalRows / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onChange(newPage, itemsPerPage);
        }
    };

    return (
        <div className="d-flex justify-content-between my-3">
            <div>
                Total Rows: {totalRows} | Page {currentPage} of {totalPages}
            </div>
            <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}

                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
        </div>
    );
};

export default CustomPagination;
