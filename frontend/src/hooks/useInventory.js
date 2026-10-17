import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInventory,
  addInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
} from '../services/api';

const MOCK_INVENTORY = [
  {
    id: '1',
    name: 'Whole Milk',
    category: 'dairy',
    quantity: 3,
    unit: 'L',
    expiryDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    daysLeft: 2,
    freshnessScore: 30,
    risk: 'HIGH',
    costPerUnit: 1.8,
    totalValue: 5.4,
  },
  {
    id: '2',
    name: 'Chicken Breast',
    category: 'meat',
    quantity: 2,
    unit: 'kg',
    expiryDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    daysLeft: 1,
    freshnessScore: 15,
    risk: 'CRITICAL',
    costPerUnit: 8.5,
    totalValue: 17.0,
  },
  {
    id: '3',
    name: 'Sourdough Bread',
    category: 'bakery',
    quantity: 1,
    unit: 'units',
    expiryDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    daysLeft: 3,
    freshnessScore: 50,
    risk: 'MEDIUM',
    costPerUnit: 4.0,
    totalValue: 4.0,
  },
  {
    id: '4',
    name: 'Spinach',
    category: 'produce',
    quantity: 500,
    unit: 'g',
    expiryDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    daysLeft: 5,
    freshnessScore: 65,
    risk: 'MEDIUM',
    costPerUnit: 2.5,
    totalValue: 2.5,
  },
  {
    id: '5',
    name: 'Cheddar Cheese',
    category: 'dairy',
    quantity: 400,
    unit: 'g',
    expiryDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    daysLeft: 14,
    freshnessScore: 88,
    risk: 'LOW',
    costPerUnit: 6.0,
    totalValue: 6.0,
  },
  {
    id: '6',
    name: 'Salmon Fillet',
    category: 'seafood',
    quantity: 1.5,
    unit: 'kg',
    expiryDate: new Date(Date.now() + 0 * 86400000).toISOString(),
    daysLeft: 0,
    freshnessScore: 5,
    risk: 'CRITICAL',
    costPerUnit: 12.0,
    totalValue: 18.0,
  },
];

export function useInventoryList(params = {}) {
  return useQuery({
    queryKey: ['inventory', params],
    queryFn: () => getInventory(params),
    placeholderData: { items: MOCK_INVENTORY, total: MOCK_INVENTORY.length },
    select: (data) => data?.items ?? data ?? MOCK_INVENTORY,
    retry: 1,
  });
}

export function useAddItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addInventoryItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateInventoryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
