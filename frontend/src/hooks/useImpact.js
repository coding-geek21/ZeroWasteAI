import { useQuery } from '@tanstack/react-query';
import { getImpact } from '../services/api';

const MOCK_IMPACT = {
  week: {
    foodSavedKg: 12.4,
    moneyRecovered: 87.5,
    co2PreventedKg: 31.0,
    mealsDonated: 24,
    trend: { foodSaved: 15, moneyRecovered: 22, co2Prevented: 15, mealsDonated: 8 },
    chart: [
      { date: 'Mon', saved: 8.2 },
      { date: 'Tue', saved: 12.1 },
      { date: 'Wed', saved: 6.5 },
      { date: 'Thu', saved: 14.3 },
      { date: 'Fri', saved: 9.8 },
      { date: 'Sat', saved: 18.5 },
      { date: 'Sun', saved: 11.2 },
    ],
    badges: ['zero_hero', 'smart_saver'],
  },
  month: {
    foodSavedKg: 54.8,
    moneyRecovered: 386.0,
    co2PreventedKg: 137.0,
    mealsDonated: 108,
    trend: { foodSaved: 18, moneyRecovered: 25, co2Prevented: 18, mealsDonated: 12 },
    chart: [
      { date: 'Week 1', saved: 12.4 },
      { date: 'Week 2', saved: 14.8 },
      { date: 'Week 3', saved: 11.2 },
      { date: 'Week 4', saved: 16.4 },
    ],
    badges: ['zero_hero', 'smart_saver', 'community_feeder'],
  },
  year: {
    foodSavedKg: 648.2,
    moneyRecovered: 4560.0,
    co2PreventedKg: 1620.0,
    mealsDonated: 1296,
    trend: { foodSaved: 32, moneyRecovered: 45, co2Prevented: 32, mealsDonated: 28 },
    chart: [
      { date: 'Jan', saved: 42 },
      { date: 'Feb', saved: 38 },
      { date: 'Mar', saved: 55 },
      { date: 'Apr', saved: 48 },
      { date: 'May', saved: 62 },
      { date: 'Jun', saved: 58 },
      { date: 'Jul', saved: 70 },
      { date: 'Aug', saved: 65 },
      { date: 'Sep', saved: 72 },
      { date: 'Oct', saved: 68 },
      { date: 'Nov', saved: 80 },
      { date: 'Dec', saved: 90 },
    ],
    badges: ['zero_hero', 'waste_warrior', 'eco_champion', 'community_feeder', 'smart_saver', 'streak_master'],
  },
};

export function useImpact(period = 'month') {
  return useQuery({
    queryKey: ['impact', period],
    queryFn: () => getImpact(period),
    placeholderData: MOCK_IMPACT[period] || MOCK_IMPACT.month,
    select: (data) => data ?? MOCK_IMPACT[period],
    retry: 1,
  });
}
