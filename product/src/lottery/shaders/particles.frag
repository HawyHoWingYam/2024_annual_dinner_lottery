// Ambient Particles Fragment Shader
// Creates soft glowing particles

varying float vOpacity;
varying vec3 vColor;

void main() {
  // Create circular particle with soft edges
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);

  // Soft circle with smooth falloff
  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  alpha *= vOpacity;

  // Cyan/blue glow
  vec3 finalColor = vColor;

  gl_FragColor = vec4(finalColor, alpha);
}
