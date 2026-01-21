// Energy Core Fragment Shader
// Creates glowing effect for the central energy core

varying float vOpacity;
varying vec3 vColor;

void main() {
  // Create circular particle with soft edges
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);

  // Soft circle with glow falloff
  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  alpha *= vOpacity;

  // Bright blue/cyan glow
  vec3 finalColor = vColor * (1.0 + dist * 0.5);

  gl_FragColor = vec4(finalColor, alpha);
}
