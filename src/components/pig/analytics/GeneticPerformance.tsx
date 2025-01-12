import React, { useState, Fragment } from 'react';
import { GeneticRecord, DEFAULT_PIG_BREEDS } from '../../../types/pig';
import { PaginationContainer } from '../../common/PaginationContainer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, Transition } from '@headlessui/react';
import { Dna } from 'lucide-react';

interface Props {
  geneticRecords: GeneticRecord[];
  onUpdate: (records: GeneticRecord[]) => void;
}

interface GeneticRecordForm {
  breedingLine: string;
  improvements: string;
  date: string;
  type: 'improvement' | 'deterioration';
}

export function GeneticPerformance({ geneticRecords = [], onUpdate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [localRecords, setLocalRecords] = useState<GeneticRecord[]>(geneticRecords);
  const [formData, setFormData] = useState<GeneticRecordForm>({
    breedingLine: '',
    improvements: '',
    date: new Date().toISOString().split('T')[0],
    type: 'improvement'
  });

  // Update local records when prop changes
  React.useEffect(() => {
    setLocalRecords(geneticRecords);
  }, [geneticRecords]);

  const addGeneticRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: GeneticRecord = {
      id: Date.now().toString(),
      breedingLine: formData.breedingLine,
      improvements: formData.improvements.split(',').map(i => i.trim()),
      date: new Date(formData.date).toISOString(),
      type: formData.type
    };

    // Update local state immediately
    const updatedRecords = [...localRecords, newRecord];
    setLocalRecords(updatedRecords);
    
    // Update parent state
    onUpdate(updatedRecords);
    
    setIsOpen(false);
    setFormData({
      breedingLine: '',
      improvements: '',
      date: new Date().toISOString().split('T')[0],
      type: 'improvement'
    });
  };

  // Calculate pagination
  const totalPages = Math.ceil(localRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const displayedRecords = localRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(startIndex, startIndex + recordsPerPage);

  // Prepare data for the graph
  const graphData = localRecords
    .reduce((acc, record) => {
      const breedingLine = record.breedingLine;
      if (!acc[breedingLine]) {
        acc[breedingLine] = {
          improvements: 0,
          deteriorations: 0
        };
      }
      if (record.type === 'deterioration') {
        acc[breedingLine].deteriorations++;
      } else {
        acc[breedingLine].improvements++;
      }
      return acc;
    }, {} as Record<string, { improvements: number; deteriorations: number }>);

  const chartData = Object.entries(graphData).map(([line, counts]) => ({
    breedingLine: line,
    improvements: counts.improvements,
    deteriorations: -counts.deteriorations // Negative to show below the x-axis
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Genetic Performance</h2>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
          Add Record
        </button>
      </div>

      {/* Graph Section */}
      {chartData.length > 0 && (
        <div className="h-64 bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="breedingLine" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="improvements" stroke="#10b981" name="Improvements" />
              <Line type="monotone" dataKey="deteriorations" stroke="#ef4444" name="Deteriorations" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {displayedRecords.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No genetic records available. Add one to get started.
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Breeding Line
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Changes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.breedingLine}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.type === 'improvement' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.type === 'improvement' ? 'Improvement' : 'Deterioration'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <ul className="list-disc list-inside">
                        {record.improvements.map((improvement, index) => (
                          <li key={index}>{improvement}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {localRecords.length > recordsPerPage && (
              <div className="bg-white px-4 py-3 border-t border-gray-200">
                <PaginationContainer
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Record Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIsOpen(false)}>
          <div className="flex items-center justify-center min-h-screen">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <Dialog.Title className="text-lg font-medium mb-4">Add Genetic Record</Dialog.Title>
              
              <form onSubmit={addGeneticRecord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Breeding Line</label>
                  <select
                    value={formData.breedingLine}
                    onChange={(e) => setFormData({ ...formData, breedingLine: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select a breed</option>
                    {DEFAULT_PIG_BREEDS.map(breed => (
                      <option key={breed.id} value={breed.name}>
                        {breed.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'improvement' | 'deterioration' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="improvement">Improvement</option>
                    <option value="deterioration">Deterioration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Changes (comma-separated)
                  </label>
                  <textarea
                    value={formData.improvements}
                    onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  >
                    Add Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 