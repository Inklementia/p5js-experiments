precision mediump float;

uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    v += a * valueNoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

  // simple movement
  float n = fbm(p * 3.0 + vec2(uTime * 0.1, uTime * 0.1));

  // cosmic colors
  vec3 col;
  col.r = n * 0.9;
  col.g = n * n * 0.8;
  col.b = 0.5 + n;

  // чуть ярче
  col *= 1.4;

  gl_FragColor = vec4(col, 1.0);
}
