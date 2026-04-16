import { useClassroomData } from '@/src/hooks/useClassroomData';
import React, { createContext, useContext } from 'react';

type ClassroomDataValue = ReturnType<typeof useClassroomData>;

const ClassroomDataContext = createContext<ClassroomDataValue | undefined>(undefined);

interface ClassroomDataProviderProps {
  children: React.ReactNode;
}

export function ClassroomDataProvider({ children }: ClassroomDataProviderProps) {
  const value = useClassroomData();
  return <ClassroomDataContext.Provider value={value}>{children}</ClassroomDataContext.Provider>;
}

export function useClassroomDataContext(): ClassroomDataValue {
  const context = useContext(ClassroomDataContext);

  if (!context) {
    throw new Error('useClassroomDataContext deve ser usado dentro de ClassroomDataProvider');
  }

  return context;
}
