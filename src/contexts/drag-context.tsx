"use client";

import { createContext, useContext, useState } from "react";

interface DragContextType {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export function DragProvider({ children }: { children: React.ReactNode }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DragContext.Provider value={{ isDragging, setIsDragging }}>
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
