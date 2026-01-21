// Energy Core Vertex Shader
// Creates pulsing effect for the central energy core

uniform float uTime;
uniform float uPulseIntensity;

varying float vOpacity;
varying vec3 vColor;

void main() {
  // Pulsing effect based on time
  float pulse = sin(uTime * 1.5) * 0.5 + 0.5;
  float scale = 1.0 + pulse * uPulseIntensity;

  // Expand particles outward with pulsing
  vec3 expandedPosition = position * scale;

  // Calculate opacity based on pulse
  vOpacity = 0.6 + pulse * 0.4;
  vColor = color;

  vec4 mvPosition = modelViewMatrix * vec4(expandedPosition, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
