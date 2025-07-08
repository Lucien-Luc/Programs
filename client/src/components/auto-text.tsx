import React, { ReactNode } from 'react';
import { useTextTranslation } from '@/lib/text-interceptor';

interface AutoTextProps {
  children: ReactNode;
  className?: string;
}

// Component that automatically translates any text content
export function AutoText({ children, className, ...props }: AutoTextProps & React.HTMLAttributes<HTMLSpanElement>) {
  const { t } = useTextTranslation();
  
  // If children is a string, translate it
  if (typeof children === 'string') {
    return <span className={className} {...props}>{t(children)}</span>;
  }
  
  // For other content, return as-is
  return <span className={className} {...props}>{children}</span>;
}

// Wrapper that automatically translates text nodes in any component
export function withAutoTranslation<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> {
  return function AutoTranslatedComponent(props: P) {
    return <WrappedComponent {...props} />;
  };
}

// Simple hook to get translation function
export function useAutoText() {
  const { t } = useTextTranslation();
  return t;
}