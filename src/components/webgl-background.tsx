'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { PortalFieldCollection } from '@/shaders/neuform-isolated/NeuformIsolatedEffects';
import '@/shaders/threeui.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebglErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('WebGL background caught error gracefully:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

/**
 * WebglBackground component integrates the ThreeUI PortalFieldCollection (variant: cloud-field)
 * wrapped in an ErrorBoundary to ensure zero blank-screen crashes.
 */
export function WebglBackground() {
  return (
    <WebglErrorBoundary>
      <div className="shader-frame" aria-hidden="true">
        <PortalFieldCollection
          variant="cloud-field"
          hue={0}
          saturation={1.0}
          brightness={1.0}
        />
      </div>
    </WebglErrorBoundary>
  );
}

export default WebglBackground;
