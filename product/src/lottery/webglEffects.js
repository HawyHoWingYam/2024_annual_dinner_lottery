/**
 * WebGL Effects Manager
 * Manages all WebGL-based visual effects for the 3D lottery sphere
 * Runs on a separate WebGL canvas layer behind the CSS3D cards
 */

import { EFFECTS_CONFIG } from './effectsConfig.js';

class WebGLEffectsManager {
  constructor(containerElement, cssCamera) {
    this.container = containerElement;
    this.cssCamera = cssCamera;
    this.config = EFFECTS_CONFIG;

    // WebGL scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.copy(cssCamera.position);

    // WebGL renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Create canvas element and insert it
    this.canvas = this.renderer.domElement;
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '1';
    this.canvas.style.pointerEvents = 'none';
    containerElement.parentElement.insertBefore(this.canvas, containerElement);

    // Particle systems
    this.particleSystems = {
      energyCore: null,
      ambientParticles: null,
      trails: []
    };

    // Laser scanning beam
    this.laserBeam = null;
    this.laserActive = false;
    this.laserRotation = 0;

    // Effects state
    this.warpActive = false;
    this.warpIntensity = 0;
    this.sphereRotation = 0;

    // Performance monitoring
    this.fps = 60;
    this.frameCount = 0;
    this.lastTime = Date.now();

    // Initialize
    this.init();
    this.setupEventListeners();
  }

  init() {
    // Load shaders
    this.loadShaders();

    // Create particle systems
    this.createEnergyCore();
    this.createAmbientParticles();
    this.createLaserBeam();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  loadShaders() {
    // Shader loading would happen here
    // For now, we'll use inline shaders or load from files
    this.shaders = {
      energyCore: {
        vertex: this.getEnergyCoreVertexShader(),
        fragment: this.getEnergyCoreFragmentShader()
      },
      particles: {
        vertex: this.getParticlesVertexShader(),
        fragment: this.getParticlesFragmentShader()
      }
    };
  }

  createEnergyCore() {
    const config = this.config.particles.energyCore;
    const geometry = new THREE.BufferGeometry();

    // Create particle positions
    const positions = new Float32Array(config.count * 3);
    const colors = new Float32Array(config.count * 3);

    for (let i = 0; i < config.count; i++) {
      // Random positions in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.random() * 50;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Blue/cyan color
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      colors[i * 3 + 2] = 1;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create material with shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPulseIntensity: { value: this.config.particles.energyCore.pulseIntensity }
      },
      vertexShader: this.shaders.energyCore.vertex,
      fragmentShader: this.shaders.energyCore.fragment,
      transparent: true,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    this.scene.add(points);
    this.particleSystems.energyCore = { points, material, geometry };
  }

  createAmbientParticles() {
    const config = this.config.particles.ambient;
    const geometry = new THREE.BufferGeometry();

    // Create particle positions
    const positions = new Float32Array(config.count * 3);
    const colors = new Float32Array(config.count * 3);

    for (let i = 0; i < config.count; i++) {
      // Random positions around sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 400 + Math.random() * 400;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Cyan color
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create material with shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: this.shaders.particles.vertex,
      fragmentShader: this.shaders.particles.fragment,
      transparent: true,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    this.scene.add(points);
    this.particleSystems.ambientParticles = { points, material, geometry };
  }

  createLaserBeam() {
    // Create laser beam geometry (a thin line around the sphere)
    const geometry = new THREE.BufferGeometry();
    const points = [];
    const segments = 128;

    // Create a circle of points at the sphere equator
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * 800;
      const z = Math.sin(angle) * 800;
      points.push(new THREE.Vector3(x, 0, z));
    }

    geometry.setFromPoints(points);

    // Create material for the laser beam
    const material = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      linewidth: 3,
      transparent: true,
      opacity: 0.8
    });

    const line = new THREE.Line(geometry, material);
    this.laserBeam = { line, material, geometry };
    // Don't add to scene yet - only add when laser is active
  }

  startLaserScan() {
    if (!this.laserBeam || this.laserActive) return;
    this.laserActive = true;
    this.laserRotation = 0;
    this.scene.add(this.laserBeam.line);
  }

  stopLaserScan() {
    if (!this.laserBeam || !this.laserActive) return;
    this.laserActive = false;
    this.scene.remove(this.laserBeam.line);
  }

  // Camera animation methods
  animateCameraZoom(targetZ, duration = 500) {
    // Animate camera zoom for dramatic effect
    const startZ = this.camera.position.z;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      this.camera.position.z = startZ + (targetZ - startZ) * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  applyCameraShake(intensity = 0.02, duration = 200) {
    // Apply camera shake effect
    const startTime = Date.now();
    const originalPos = this.camera.position.clone();

    const shake = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        // Random shake
        this.camera.position.x = originalPos.x + (Math.random() - 0.5) * intensity * 100;
        this.camera.position.y = originalPos.y + (Math.random() - 0.5) * intensity * 100;
        requestAnimationFrame(shake);
      } else {
        // Reset to original position
        this.camera.position.copy(originalPos);
      }
    };

    shake();
  }

  // Shader getters (inline shaders)
  getEnergyCoreVertexShader() {
    return `
      uniform float uTime;
      uniform float uPulseIntensity;
      varying float vOpacity;
      varying vec3 vColor;

      void main() {
        float pulse = sin(uTime * 1.5) * 0.5 + 0.5;
        float scale = 1.0 + pulse * uPulseIntensity;
        vec3 expandedPosition = position * scale;
        vOpacity = 0.6 + pulse * 0.4;
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(expandedPosition, 1.0);
        gl_PointSize = 3.0 * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
  }

  getEnergyCoreFragmentShader() {
    return `
      varying float vOpacity;
      varying vec3 vColor;

      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float dist = length(uv);
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha *= vOpacity;
        vec3 finalColor = vColor * (1.0 + dist * 0.5);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;
  }

  getParticlesVertexShader() {
    return `
      uniform float uTime;
      varying float vOpacity;
      varying vec3 vColor;

      void main() {
        vec3 driftedPosition = position;
        driftedPosition.x += sin(uTime * 0.3 + position.y) * 0.5;
        driftedPosition.y += cos(uTime * 0.2 + position.z) * 0.3;
        driftedPosition.z += sin(uTime * 0.25 + position.x) * 0.4;
        float depth = length(driftedPosition);
        vOpacity = 0.3 + (1.0 - depth / 1000.0) * 0.4;
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(driftedPosition, 1.0);
        gl_PointSize = 2.0 * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
  }

  getParticlesFragmentShader() {
    return `
      varying float vOpacity;
      varying vec3 vColor;

      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float dist = length(uv);
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha *= vOpacity;
        gl_FragColor = vec4(vColor, alpha);
      }
    `;
  }

  // Public methods for triggering effects
  startWarpEffect() {
    this.warpActive = true;
    this.warpIntensity = 0;
  }

  stopWarpEffect() {
    this.warpActive = false;
    this.warpIntensity = 0;
  }

  setWarpIntensity(intensity) {
    this.warpIntensity = Math.min(intensity, 1.0);
  }

  setSphereRotation(rotation) {
    this.sphereRotation = rotation;
    // Rotate the entire scene to match CSS3D sphere
    this.scene.rotation.y = rotation;
  }

  createWinnerTrail(startPos, endPos) {
    // Create particle trail from start to end position
    const trailGeometry = new THREE.BufferGeometry();
    const trailPositions = [];
    const trailColors = [];

    // Create trail particles along the path
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = startPos.x + (endPos.x - startPos.x) * t;
      const y = startPos.y + (endPos.y - startPos.y) * t;
      const z = startPos.z + (endPos.z - startPos.z) * t;

      trailPositions.push(x, y, z);
      trailColors.push(0, 1, 1); // Cyan color
    }

    trailGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(trailPositions), 3));
    trailGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(trailColors), 3));

    const trailMaterial = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const trail = new THREE.Points(trailGeometry, trailMaterial);
    this.scene.add(trail);
    this.particleSystems.trails.push({ trail, material: trailMaterial, createdAt: Date.now() });

    // Auto-remove trail after 2 seconds
    setTimeout(() => {
      this.scene.remove(trail);
      this.particleSystems.trails = this.particleSystems.trails.filter(t => t.trail !== trail);
    }, 2000);
  }

  updateTrailPosition(cardIndex, position) {
    // Update trail positions as cards move
    // Trails are managed automatically with auto-removal
  }

  // Rendering
  render() {
    // Update time uniforms
    const time = Date.now() * 0.001;

    if (this.particleSystems.energyCore) {
      this.particleSystems.energyCore.material.uniforms.uTime.value = time;
    }

    if (this.particleSystems.ambientParticles) {
      this.particleSystems.ambientParticles.material.uniforms.uTime.value = time;
    }

    // Animate laser beam if active
    if (this.laserActive && this.laserBeam) {
      this.laserRotation += 0.05; // Rotation speed
      this.laserBeam.line.rotation.y = this.laserRotation;

      // Pulsing opacity effect
      const pulse = Math.sin(time * 3) * 0.3 + 0.7;
      this.laserBeam.material.opacity = pulse;
    }

    // Sync camera with CSS3D camera
    this.camera.position.copy(this.cssCamera.position);
    this.camera.quaternion.copy(this.cssCamera.quaternion);

    // Render WebGL scene
    this.renderer.render(this.scene, this.camera);

    // Update FPS
    this.updateFPS();
  }

  updateFPS() {
    this.frameCount++;
    const now = Date.now();
    const elapsed = now - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;

      // Auto-adjust quality if FPS is too low
      if (this.config.performance.autoAdjustQuality && this.fps < this.config.performance.fpsThreshold) {
        this.reduceQuality();
      }
    }
  }

  reduceQuality() {
    // Reduce particle counts if performance is poor
    if (this.particleSystems.ambientParticles) {
      // Could reduce particle count here
    }
  }

  // Event handlers
  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // Cleanup
  dispose() {
    this.renderer.dispose();
    if (this.particleSystems.energyCore) {
      this.particleSystems.energyCore.geometry.dispose();
      this.particleSystems.energyCore.material.dispose();
    }
    if (this.particleSystems.ambientParticles) {
      this.particleSystems.ambientParticles.geometry.dispose();
      this.particleSystems.ambientParticles.material.dispose();
    }
  }
}

export { WebGLEffectsManager };
