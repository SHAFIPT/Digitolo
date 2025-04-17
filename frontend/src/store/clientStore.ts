import { store, persistor } from './store';

// Safe access to store for client-side only
export const getClientStore = () => store;
export const getClientPersistor = () => persistor;

// Helper function to check if we're on client
export const isClient = typeof window !== 'undefined';