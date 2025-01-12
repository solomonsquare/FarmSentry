import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { FeedConversionRecord } from '../../../types/pig';
import { PaginationContainer } from '../../common/PaginationContainer';
import { FeedConversionForm } from './FeedConversionForm';

interface Props {
  feedConversion: FeedConversionRecord[];
  currentPage: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onUpdate: (records: FeedConversionRecord[]) => void;
}

export function FeedConversionAnalytics({ 
  feedConversion, 
  currentPage, 
  recordsPerPage,
  onPageChange, 
  onUpdate 
}: Props) {
  console.log('FeedConversionAnalytics render:', { feedConversion, currentPage, recordsPerPage });
  
  // Calculate pagination
  const totalPages = Math.ceil(feedConversion.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const displayedRecords = feedConversion.slice(startIndex, startIndex + recordsPerPage);

  const handleFeedConversionUpdate = (records: FeedConversionRecord[]) => {
    onPageChange(1); // Reset to first page when adding new record
    onUpdate(records);
  };

  return (
    <div className="space-y-4">
      <FeedConversionForm
        onSubmit={handleFeedConversionUpdate}
        records={feedConversion}
      />

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">FCR History</h3>
        <div className="bg-white border rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date Range
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phase
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Initial Weight
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Final Weight
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Feed Consumed
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    FCR
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.startDate} to {record.endDate}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.phase}</td>
                    <td className="px-4 py-2 text-sm text-right">{record.initialWeight.toFixed(1)} kg</td>
                    <td className="px-4 py-2 text-sm text-right">{record.finalWeight.toFixed(1)} kg</td>
                    <td className="px-4 py-2 text-sm text-right">{record.feedConsumed.toFixed(1)} kg</td>
                    <td className="px-4 py-2 text-sm text-right">{record.fcr.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <button
                        onClick={() => handleFeedConversionUpdate([record])}
                        className="text-teal-600 hover:text-teal-800"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {feedConversion.length > recordsPerPage && (
          <div className="mt-4">
            <PaginationContainer
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
} 