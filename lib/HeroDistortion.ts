import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision mediump float;
varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_scale;
uniform float u_waveSpeed;
uniform float u_waveAmplitude;
uniform float u_colorIntensity;
uniform float u_mixSpeed;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 1.0;
  float freq = 1.0;
  for(int i = 0; i < 6; i++) {
    sum += amp * snoise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return sum;
}

vec3 generateGradientPatch(vec2 localUV, vec3 color1, vec3 color2, float intensity) {
  float d = length(localUV);
  float gradient = 1.0 - smoothstep(0.0, 1.0, d);
  return mix(color1, color2, gradient) * intensity;
}

vec3 applyPatch(vec2 uv, float time, float a, float b, float delta, vec3 c1, vec3 c2, float intensity) {
  float x = 0.5 + 0.3 * sin(a * time + delta);
  float y = 0.5 + 0.3 * sin(b * time);
  float scale = 0.2 + 0.05 * sin(1.5 * a * time);
  return generateGradientPatch((uv - vec2(x, y)) / scale, c1, c2, intensity);
}

void main() {
  vec2 uv = vUv;
  uv -= u_center;
  uv.x *= u_resolution.x / u_resolution.y;
  uv *= u_scale;

  float waveX = fbm(uv * 2.0 + u_time * u_waveSpeed) * u_waveAmplitude;
  float waveY = fbm(uv * 2.0 - u_time * u_waveSpeed * 0.8 + 50.0) * u_waveAmplitude;
  vec2 distortedUV = uv + vec2(waveX, waveY);

  float t = u_time * u_mixSpeed;

  vec3 colors[6];
  colors[0] = vec3(0.78, 0.62, 1.0);
  colors[1] = vec3(1.0, 0.62, 0.81);
  colors[2] = vec3(1.0, 0.81, 0.62);
  colors[3] = vec3(0.62, 0.94, 1.0);
  colors[4] = vec3(0.78, 1.0, 0.62);
  colors[5] = vec3(1.0, 0.83, 0.62);

  vec3 softColors[6];
  softColors[0] = vec3(0.83, 0.72, 1.0);
  softColors[1] = vec3(1.0, 0.72, 0.83);
  softColors[2] = vec3(1.0, 0.88, 0.76);
  softColors[3] = vec3(0.76, 0.95, 1.0);
  softColors[4] = vec3(0.83, 1.0, 0.72);
  softColors[5] = vec3(1.0, 0.88, 0.76);

  vec3 finalColor = vec3(0.0);

  float aBase[6];
  aBase[0] = 1.0;
  aBase[1] = 1.2;
  aBase[2] = 0.8;
  aBase[3] = 1.1;
  aBase[4] = 0.9;
  aBase[5] = 1.3;

  float bBase[6];
  bBase[0] = 1.1;
  bBase[1] = 0.9;
  bBase[2] = 1.2;
  bBase[3] = 1.0;
  bBase[4] = 1.3;
  bBase[5] = 0.8;

  for(int i = 0; i < 6; i++) {
    finalColor += applyPatch(distortedUV, t, aBase[i], bBase[i], float(i) * 1.047, colors[i], softColors[i], u_colorIntensity);
  }

  float vignette = smoothstep(1.2, 0.3, length(uv));
  finalColor *= vignette;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface DistortionOptions {
  center?: { x: number; y: number };
  scale?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  colorIntensity?: number;
  mixSpeed?: number;
}

export class HeroDistortion {
  container: HTMLElement;
  width: number;
  height: number;
  options: Required<DistortionOptions>;
  time: number;
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  clock!: THREE.Clock;
  material!: THREE.ShaderMaterial;
  private _animate!: () => void;
  private animationId: number | null = null;

  constructor(container: HTMLElement, options: DistortionOptions = {}) {
    this.container = container;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.options = {
      center: { x: 0.5, y: 0.5 },
      scale: 1.0,
      waveSpeed: 0.2,
      waveAmplitude: 0.4,
      colorIntensity: 0.6,
      mixSpeed: 0.1,
      ...options,
    };
    this.time = 0;
    this.init();
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 10);
    this.camera.position.z = 1;
    this.clock = new THREE.Clock();

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(this.width, this.height) },
      u_center: { value: new THREE.Vector2(this.options.center.x, this.options.center.y) },
      u_scale: { value: this.options.scale },
      u_waveSpeed: { value: this.options.waveSpeed },
      u_waveAmplitude: { value: this.options.waveAmplitude },
      u_colorIntensity: { value: this.options.colorIntensity },
      u_mixSpeed: { value: this.options.mixSpeed },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.scene.add(mesh);

    this._animate = this.animate.bind(this);
    window.addEventListener('resize', this.onResize.bind(this));
    this.animationId = requestAnimationFrame(this._animate);
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.material.uniforms.u_resolution.value.set(this.width, this.height);
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    this.animationId = requestAnimationFrame(this._animate);
    const elapsed = this.clock.getElapsedTime();
    this.material.uniforms.u_time.value = elapsed;
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onResize.bind(this));
    this.renderer.dispose();
    this.material.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
