import { useQuery } from '@tanstack/react-query';
import { getPredictions } from '../services/api';

const MOCK_PREDICTIONS = [
  {
    itemId: '1',
    itemName: 'Whole Milk',
    predictedWasteDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    confidence: 0.91,
    recommendedAction: 'DISCOUNT',
    estimatedSavings: 5.4,
    daysLeft: 2,
    risk: 'HIGH',
  },
  {
    itemId: '2',
    itemName: 'Chicken Breast',
    predictedWasteDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    confidence: 0.97,
    recommendedAction: 'RECIPE',
    estimatedSavings: 17.0,
    daysLeft: 1,
    risk: 'CRITICAL',
  },
  {
    itemId: '6',
    itemName: 'Salmon Fillet',
    predictedWasteDate: new Date().toISOString(),
    confidence: 0.99,
    recommendedAction: 'DONATE',
    estimatedSavings: 18.0,
    daysLeft: 0,
    risk: 'CRITICAL',
  },
];

export function usePredictions() {
  return useQuery({
    queryKey: ['predictions'],
    queryFn: getPredictions,
    placeholderData: MOCK_PREDICTIONS,
    select: (data) => data?.predictions ?? data ?? MOCK_PREDICTIONS,
    refetchInterval: 5 * 60 * 1000, // refresh every 5 minutes
    retry: 1,
  });
}
