import { defineShader, wgsl, transformColor, transformPosition } from 'shaders/std'

/**
 * Custom WGSL Shader built with `shaders/std` (`defineShader` + `wgsl`)
 * Simulates warm Hinoki (Japanese cypress) thermal spring ripples, mineral caustics,
 * and interactive cursor-driven water waves.
 */
export const HinokiThermalWave = defineShader({
  name: 'HinokiThermalWave',
  animatedTime: { speed: 'speed' },
  props: {
    deepWater: { default: '#0b192c', transform: transformColor },
    mineralTeal: { default: '#1e5f74', transform: transformColor },
    hinokiAmber: { default: '#d97706', transform: transformColor },
    steamGlow: { default: '#fde68a', transform: transformColor },
    center: { default: { x: 0.5, y: 0.55 }, transform: transformPosition },
    ringCount: { default: 7.0 },
    speed: { default: 0.85 },
  },
  paint: wgsl`
    let p = (uv - center) * vec2f(aspect, 1.0);
    let mp = (uv - pointer) * vec2f(aspect, 1.0);
    let distCenter = length(p);
    let distMouse = length(mp);

    // Dual concentric thermal spring waves (source + interactive pointer)
    let wave1 = sin(distCenter * ringCount * 6.2831853 - time * 2.4);
    let wave2 = sin(distMouse * (ringCount * 1.4) * 6.2831853 - time * 3.6) * exp(-distMouse * 2.8);

    // Organic rising steam caustic modulation
    let steamSwirl = sin(uv.x * 9.0 + time * 1.1 + sin(uv.y * 6.0 - time * 1.5)) * 0.5 + 0.5;
    let combinedWave = clamp((wave1 * 0.5 + 0.5) * (1.0 - smoothstep(0.0, 1.15, distCenter)) + wave2 * 0.55, 0.0, 1.0);

    // Blend deep thermal water -> mineral teal -> warm hinoki amber -> steam glow
    let baseMix = mix(deepWater.rgb, mineralTeal.rgb, smoothstep(0.0, 0.85, 1.0 - uv.y * 0.7 + steamSwirl * 0.25));
    let hinokiMix = mix(baseMix, hinokiAmber.rgb, combinedWave * 0.58);
    let highlight = pow(max(combinedWave, 0.0), 3.2) * 0.65;
    let finalRgb = mix(hinokiMix, steamGlow.rgb, highlight);

    return vec4f(finalRgb, 1.0);
  `,
})
