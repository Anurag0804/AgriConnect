import { getCustomerOrders, getFarmerOrders } from './orderService';
import { getCustomerTransactions, getFarmerTransactions } from './transactionService';
import { getCustomerInventory } from './inventoryService';
import { getCurrentUser } from './authService';

export const getOrders = async () => {
  const user = getCurrentUser();
  if (user.role === 'farmer') {
    return getFarmerOrders();
  } else {
    return getCustomerOrders();
  }
};

export const getTransactions = async () => {
  const user = getCurrentUser();
  if (user.role === 'farmer') {
    return getFarmerTransactions();
  } else {
    return getCustomerTransactions();
  }
};

export const getInventory = async () => {
  const user = getCurrentUser();
  if (user.role === 'customer') {
    return getCustomerInventory();
  } else {
    return []; // Farmers don't have an inventory in the same way customers do
  }
};
