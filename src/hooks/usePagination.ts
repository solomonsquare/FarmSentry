import { useState, useMemo } from 'react';

interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  displayedRecords: T[];
  setCurrentPage: (page: number) => void;
}

export function usePagination<T>(records: T[], recordsPerPage: number = 5): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const { totalPages, displayedRecords } = useMemo(() => {
    const total = Math.ceil(records.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const displayed = records.slice(startIndex, startIndex + recordsPerPage);

    return {
      totalPages: total,
      displayedRecords: displayed
    };
  }, [records, currentPage, recordsPerPage]);

  return {
    currentPage,
    totalPages,
    displayedRecords,
    setCurrentPage
  };
} 