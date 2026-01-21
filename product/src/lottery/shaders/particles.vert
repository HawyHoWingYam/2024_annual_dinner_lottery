// Ambient Particles Vertex Shader
// Creates drifting particles around the sphere

uniform float uTime;

varying float vOpacity;
varying vec3 vColor;

void main() {
  // Slow drift motion based on particle position and time
  vec3 driftedPosition = position;
  driftedPosition.x += sin(uTime * 0.3 + position.y) * 0.5;
  driftedPosition.y += cos(uTime * 0.2 + position.z) * 0.3;
  driftedPosition.z += sin(uTime * 0.25 + position.x) * 0.4;

  // Depth-based opacity: particles farther away are more transparent
  float depth = length(driftedPosition);
  vOpacity = 0.3 + (1.0 - depth / 1000.0) * 0.4;
  vColor = color;

  vec4 mvPosition = modelViewMatrix * vec4(driftedPosition, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
