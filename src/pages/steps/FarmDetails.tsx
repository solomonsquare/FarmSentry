import React from 'react';
import { Users, Calendar } from 'lucide-react';

interface Props {
  formData: any;
  updateFormData: (data: any) => void;
}

export function FarmDetails({ formData, updateFormData }: Props) {
  const animalType = formData.farmType === 'birds' ? 'birds' : 'pigs';

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Farm Details</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How many {animalType} do you manage?
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              value={formData.farmSize}
              onChange={(e) => updateFormData({ farmSize: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter number"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your farming experience?
          </label>
          <select
            value={formData.experience}
            onChange={(e) => updateFormData({ experience: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select experience level</option>
            <option value="beginner">Just starting out (0-1 year)</option>
            <option value="intermediate">Some experience (1-3 years)</option>
            <option value="advanced">Experienced farmer (3+ years)</option>
          </select>
        </div>
      </div>
    </div>
  );
}