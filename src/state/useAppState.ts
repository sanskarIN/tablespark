import { useContext } from 'react';
import { AppStateContext, type AppStateValue } from './AppStateContext';

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useAppState must be used inside AppStateProvider.');
  return value;
}
