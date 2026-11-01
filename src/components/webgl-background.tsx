'use client';

import React from 'react';
import { PortalFieldCollection } from '@/shaders/neuform-isolated/NeuformIsolatedEffects';
import '@/shaders/threeui.css';

/**
 * WebglBackground component integrates the ThreeUI PortalFieldCollection (variant: cloud-field)
 * rendering raw WebGL animated purple cloud dunes, starfield, and meteors with mouse parallax.
 */
export function WebglBackground() {
  return (
    <div className="shader-frame" aria-hidden="true">
      <PortalFieldCollection
        variant="cloud-field"
        hue={0}
        saturation={1.0}
        brightness={1.0}
      />
    </div>
  );
}

export default WebglBackground;
