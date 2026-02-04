"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface DragContextType {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export function DragProvider({ children }: { children: React.ReactNode }) {
  const [isDragging, setIsDragging] = useState(false);

  const setIsDraggingCallback = useCallback((isDragging: boolean) => {
    setIsDragging(isDragging);
  }, []);

  const value = useMemo(
    () => ({ isDragging, setIsDragging: setIsDraggingCallback }),
    [isDragging, setIsDraggingCallback]
  );

  return (
    <DragContext.Provider value={value}>
      {children}
    </DragContext.Provider>
  );
}

export function useDrag() {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error("useDrag must be used within a DragProvider");
  }
  return context;
}
