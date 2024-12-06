import { createContext, useContext } from 'react';
import { Model } from './Model';

export const ModelContext = createContext<Model | null>(null);

export const useModel = () => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
};