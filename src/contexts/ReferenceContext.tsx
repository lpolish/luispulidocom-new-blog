'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Reference {
  id: string;
  number: string;
  title: string;
  url: string;
}

interface ReferenceContextType {
  references: Map<string, Reference>;
  setReferences: (references: Map<string, Reference>) => void;
  activeReference: Reference | null;
  activeElement: HTMLElement | null;
  showReference: (referenceId: string, element: HTMLElement) => void;
  hideReference: () => void;
  isReferenceVisible: boolean;
}

const ReferenceContext = createContext<ReferenceContextType | undefined>(undefined);

interface ReferenceProviderProps {
  children: ReactNode;
}

export function ReferenceProvider({ children }: ReferenceProviderProps) {
  const [references, setReferences] = useState<Map<string, Reference>>(new Map());
  const [activeReference, setActiveReference] = useState<Reference | null>(null);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [isReferenceVisible, setIsReferenceVisible] = useState(false);

  const showReference = useCallback((referenceId: string, element: HTMLElement) => {
    const reference = references.get(referenceId);
    if (reference) {
      setActiveReference(reference);
      setActiveElement(element);
      setIsReferenceVisible(true);
    }
  }, [references]);

  const hideReference = useCallback(() => {
    setActiveReference(null);
    setActiveElement(null);
    setIsReferenceVisible(false);
  }, []);

  const value: ReferenceContextType = {
    references,
    setReferences,
    activeReference,
    activeElement,
    showReference,
    hideReference,
    isReferenceVisible,
  };

  return (
    <ReferenceContext.Provider value={value}>
      {children}
    </ReferenceContext.Provider>
  );
}

export function useReferences() {
  const context = useContext(ReferenceContext);
  if (context === undefined) {
    throw new Error('useReferences must be used within a ReferenceProvider');
  }
  return context;
}

// Hook for easier reference link management
export function useReferenceLink() {
  const { showReference, hideReference } = useReferences();

  const handleReferenceClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const element = event.currentTarget;
    const referenceId = element.getAttribute('data-reference-id');
    
    if (referenceId) {
      showReference(referenceId, element);
    }
  }, [showReference]);

  const handleReferenceHover = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const referenceId = element.getAttribute('data-reference-id');
    
    if (referenceId) {
      showReference(referenceId, element);
    }
  }, [showReference]);

  const handleReferenceLeave = useCallback(() => {
    // Add a small delay to prevent flickering when moving to popover
    setTimeout(() => {
      hideReference();
    }, 100);
  }, [hideReference]);

  return {
    handleReferenceClick,
    handleReferenceHover,
    handleReferenceLeave,
  };
}