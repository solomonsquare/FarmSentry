import React from 'react';
import { GrowthStage } from '../../types/pig';
import { differenceInDays } from 'date-fns';
import { Scale, Calendar, Target } from 'lucide-react';

interface Props {
  birthDate: string;
  currentWeight: number;
  stages: GrowthStage[];
}

export function GrowthStageDisplay({ birthDate, currentWeight, stages }: Props) {
  // Calculate current age in days
  const currentAge = differenceInDays(new Date(), new Date(birthDate));

  // Find current stage
  const currentStage = stages.find(
    stage => currentAge >= stage.startAge && (stage.endAge === -1 || currentAge <= stage.endAge)
  );

  // Calculate progress percentage within current stage
  const calculateProgress = (stage: GrowthStage) => {
    if (!stage) return 0;
    if (stage.endAge === -1) return 100; // Breeding age has no end

    const stageLength = stage.endAge - stage.startAge;
    const daysInStage = currentAge - stage.startAge;
    return Math.min(Math.max((daysInStage / stageLength) * 100, 0), 100);
  };

  // Calculate weight status
  const getWeightStatus = (stage: GrowthStage) => {
    if (!stage) return 'unknown';
    
    const { min, max } = stage.expectedWeightRange;
    if (currentWeight < min) return 'below';
    if (currentWeight > max) return 'above';
    return 'normal';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-medium text-blue-600">Current Age</h3>
          </div>
          <p className="text-xl font-semibold text-blue-700">{currentAge} days</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5 text-green-600" />
            <h3 className="text-sm font-medium text-green-600">Current Weight</h3>
          </div>
          <p className="text-xl font-semibold text-green-700">{currentWeight.toFixed(1)} kg</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-medium text-purple-600">Current Stage</h3>
          </div>
          <p className="text-xl font-semibold text-purple-700">{currentStage?.name || 'Unknown'}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg">
        <div className="space-y-3">
          {stages.map((stage) => {
            const isCurrentStage = stage.id === currentStage?.id;
            const progress = isCurrentStage ? calculateProgress(stage) : 
              currentAge > stage.endAge ? 100 : 0;
            
            return (
              <div key={stage.id} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{stage.name}</span>
                    <span className="text-gray-500">
                      ({stage.startAge}-{stage.endAge === -1 ? '∞' : stage.endAge} days)
                    </span>
                  </div>
                  <div className="text-gray-500">
                    {stage.expectedWeightRange.min}-{stage.expectedWeightRange.max} kg
                  </div>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isCurrentStage ? 'bg-blue-500' : 
                        progress === 100 ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {isCurrentStage && (
                    <div className="absolute -right-1 -top-8 transform translate-x-1/2">
                      <div className={`px-2 py-1 text-xs font-medium rounded ${
                        getWeightStatus(stage) === 'normal' ? 'bg-green-100 text-green-800' :
                        getWeightStatus(stage) === 'below' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getWeightStatus(stage) === 'normal' ? 'On Track' :
                         getWeightStatus(stage) === 'below' ? 'Below Target' :
                         'Above Target'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}