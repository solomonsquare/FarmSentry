import { PaginationContainer } from '../common/PaginationContainer';

// ... rest of imports

export function AnalyticsHistory({ data }: Props) {
  // ... existing state and logic

  return (
    <div>
      {/* ... table content ... */}
      
      {data.length > recordsPerPage && (
        <PaginationContainer
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
} 