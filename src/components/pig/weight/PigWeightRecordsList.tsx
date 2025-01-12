import React, { useState, useEffect } from 'react';
import { PaginationContainer } from '../../common/PaginationContainer';
import { formatDate } from '../../../utils/date';

interface WeightRecord {
  id: string;
  date: string;
  pigId: string;
  weight: number;
  notes?: string;
}

interface Props {
  records: WeightRecord[];
}

export function PigWeightRecordsList({ records }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedRecords, setPaginatedRecords] = useState<WeightRecord[]>([]);
  const recordsPerPage = 5;

  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;

  useEffect(() => {
    // Update paginatedRecords whenever currentPage changes
    setPaginatedRecords(records.slice(startIndex, startIndex + recordsPerPage));
  }, [currentPage, records]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Pig ID</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Weight (kg)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{formatDate(record.date)}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{record.pigId}</td>
                <td className="px-4 py-2 text-sm text-right">{record.weight.toFixed(1)}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{record.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {records.length > recordsPerPage && (
        <PaginationContainer
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
} 