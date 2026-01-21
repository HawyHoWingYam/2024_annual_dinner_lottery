/**
 * Effects Configuration
 * Central configuration for all visual effects
 */

export const EFFECTS_CONFIG = {
  // Performance settings
  performance: {
    targetFPS: 60,
    autoAdjustQuality: true,
    enableFPSMonitoring: true,
    fpsThreshold: 30 // Auto-disable effects if FPS drops below this
  },

  // Particle system settings
  particles: {
    ambient: {
      count: 2000,
      size: 2,
      color: 0x00ffff,
      speed: 0.5,
      enabled: true,
      opacity: 0.6
    },
    energyCore: {
      count: 1000,
      size: 3,
      pulseSpeed: 1.5,
      color: 0x0088ff,
      enabled: true,
      pulseIntensity: 1.0
    },
    trails: {
      count: 50,
      lifetime: 2.0,
      color: 0x00ffff,
      enabled: true,
      trailLength: 20
    }
  },

  // Card visual effects
  cards: {
    holographicIntensity: 0.8,
    neonGlowIntensity: 1.0,
    scanlineSpeed: 2.0,
    glitchEnabled: true,
    glitchDuration: 0.5
  },

  // Animation settings
  animation: {
    warpSpeedEnabled: true,
    warpSpeedDuration: 1000, // milliseconds
    cameraShakeEnabled: true,
    cameraShakeIntensity: 0.02,
    laserScanEnabled: true,
    laserScanDuration: 3000
  },

  // Camera settings
  camera: {
    zoomInDistance: 2500,
    zoomOutDistance: 3000,
    zoomDuration: 500
  },

  // Background effects
  background: {
    starfieldEnabled: true,
    starfieldColor: { r: 0, g: 100, b: 255 },
    gridEnabled: false,
    gridColor: { r: 0, g: 255, b: 255 }
  },

  // Mobile overrides (if needed in future)
  mobile: {
    particles: {
      ambient: { count: 500 },
      energyCore: { count: 300 },
      trails: { enabled: false }
    },
    cards: {
      holographicIntensity: 0.5,
      neonGlowIntensity: 0.7
    },
    animation: {
      warpSpeedEnabled: true,
      cameraShakeEnabled: false,
      laserScanEnabled: false
    }
  }
};

/**
 * Get effective config based on device capabilities
 */
export function getEffectiveConfig(isMobile = false) {
  if (isMobile) {
    return {
      ...EFFECTS_CONFIG,
      particles: {
        ...EFFECTS_CONFIG.particles,
        ...EFFECTS_CONFIG.mobile.particles
      },
      cards: {
        ...EFFECTS_CONFIG.cards,
        ...EFFECTS_CONFIG.mobile.cards
      },
      animation: {
        ...EFFECTS_CONFIG.animation,
        ...EFFECTS_CONFIG.mobile.animation
      }
    };
  }
  return EFFECTS_CONFIG;
}
