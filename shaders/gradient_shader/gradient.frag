precision mediump float;

varying vec2 pos;

void main() {
  // Just make it white 
  // gl_FragColor = vec4(1.);
  
  // Single colour
  // gl_FragColor = vec4(1., 0., 1., 1.);
  
  // 1D gradient
  // gl_FragColor = vec4(pos.x, 0., 1., 1.);
  
  // 2D gradient
  // gl_FragColor = vec4(pos, 1., 1.);
  
  // Custom colours using mix
  // vec4 c1 = vec4(0.5, 0.1, 0.9, 1.);
  // vec4 c2 = vec4(0.1, 0.8, 0.7, 1.);
  // vec4 c = mix(c1, c2, pos.x);
  // gl_FragColor = c;
  

  // 2D gradient using mix
  // vec4 tl = vec4(0.5, 0.1, 0.9, 1.);
  // vec4 tr = vec4(0.3, 1., 0.8, 1.);
  // vec4 bl = vec4(0.8, 0.6, 0.1, 1.);
  // vec4 br = vec4(0.7, 0.1, 0.2, 1.);
  // vec4 top = mix(tl, tr, pos.x);
  // vec4 bottom = mix(bl, br, pos.x);
  // vec4 c = mix(bottom, top, pos.y);
  // gl_FragColor = c;

  // Repeating pattern
   vec2 newPos = fract(pos * 10.);
   gl_FragColor = vec4(newPos, 1., 1.);
}

  
  