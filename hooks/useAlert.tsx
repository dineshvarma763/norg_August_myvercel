'use client';

import { AlertContext } from '@/context/AlertContainer';
import { useContext } from 'react';

export function useAlert() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within an AlertContainer');
  }

  return context;
}
