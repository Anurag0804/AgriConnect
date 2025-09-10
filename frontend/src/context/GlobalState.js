import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { getOrders, getTransactions, getInventory } from '../services/api'; // Assuming you have an api service

const initialState = {
  orders: [],
  transactions: [],
  inventory: [],
  loading: true,
  error: null,
};

const GlobalContext = createContext(initialState);

const globalReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  const fetchData = useCallback(async () => {
    try {
      const [orders, transactions, inventory] = await Promise.all([
        getOrders(),
        getTransactions(),
        getInventory(),
      ]);
      dispatch({ type: 'FETCH_SUCCESS', payload: { orders, transactions, inventory } });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <GlobalContext.Provider value={{ ...state, fetchData }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
