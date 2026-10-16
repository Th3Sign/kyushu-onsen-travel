import React, { useState } from 'react'
import {
  Shader,
  ImageTexture,
  Aurora,
  FloatingParticles,
  SimplexNoise,
  CursorTrail,
  CursorRipples,
  Smoke,
  Glass,
  Vignette,
  CustomShader,
} from 'shaders/react'
import { HinokiThermalWave } from '../shaders/customOnsenShader'

export type OnsenShaderMood = 'yufuin-mist' | 'ureshino-silk' | 'beppu-steam' | 'hinoki-wgsl'

interface HeroOnsenShaderProps {
  mood: OnsenShaderMood
  speedMultiplier?: number
  interactiveTrail?: boolean
  onGpuStatusChange?: (status: 'ready' | 'fallback', reason?: string) => void
}

export const HERO_BG_BY_MOOD: Record<OnsenShaderMood, string> = {
  'yufuin-mist': '/images/dest-yufuin.png',
  'ureshino-silk': '/images/dest-ureshino.png',
  'beppu-steam': '/images/dest-beppu.png',
  'hinoki-wgsl': '/images/bg-hero-onsen.png',
}

export const HeroOnsenShader: React.FC<HeroOnsenShaderProps> = ({
  mood,
  speedMultiplier = 1,
  interactiveTrail = true,
  onGpuStatusChange,
}) => {
  const [gpuAvailable, setGpuAvailable] = useState<boolean>(true)
  const bgUrl = HERO_BG_BY_MOOD[mood]

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-auto bg-cover bg-center transition-all duration-700"
      style={{
        backgroundImage: `url('${bgUrl}')`,
      }}
    >
      {gpuAvailable && (
        <Shader
          className="w-full h-full"
          onReady={() => onGpuStatusChange?.('ready')}
          onUnavailable={(reason) => {
            setGpuAvailable(false)
            onGpuStatusChange?.('fallback', String(reason))
          }}
        >
          {mood === 'yufuin-mist' && (
            <>
              <ImageTexture url="/images/dest-yufuin.png" objectFit="cover" />
              <CursorRipples intensity={8} decay={10} radius={0.35} chromaticSplit={0.6} />
              <Aurora
                colorA="#f59e0b"
                colorB="#38bdf8"
                colorC="#fde68a"
                colorSpace="oklch"
                curtainCount={3}
                intensity={55}
                waviness={50}
                rayDensity={16}
                speed={2.2 * speedMultiplier}
                opacity={0.42}
                blendMode="screen"
              />
              <FloatingParticles
                count={700}
                speed={0.22 * speedMultiplier}
                angle={90}
                particleSize={1.35}
                softness={0.65}
                twinkle={0.7}
                particleColor="#fef3c7"
                cursorStrength={0.45}
                opacity={0.65}
                blendMode="screen"
              />
              {interactiveTrail && (
                <CursorTrail
                  colorA="#fde68a"
                  colorB="#38bdf8"
                  radius={0.45}
                  length={0.55}
                  softness={0.6}
                  opacity={0.45}
                  blendMode="screen"
                />
              )}
              <Vignette color="#060911" radius={0.48} falloff={0.55} intensity={0.68} />
            </>
          )}

          {mood === 'ureshino-silk' && (
            <>
              <ImageTexture url="/images/dest-ureshino.png" objectFit="cover" />
              <CursorRipples intensity={11} decay={9} radius={0.4} chromaticSplit={0.8} />
              <Glass
                shape={{ type: 'circleSDF', radius: 0.28 }}
                center={{ type: 'mouse-position', smoothing: 0.15, momentum: 0.2 }}
                refraction={0.85}
                thickness={0.5}
                aberration={0.35}
                fresnel={0.25}
                edgeSoftness={0.15}
              />
              <SimplexNoise
                colorA="#042f2e"
                colorB="#fef3c7"
                scale={3}
                speed={0.4 * speedMultiplier}
                opacity={0.14}
                blendMode="softLight"
              />
              <Vignette color="#040d12" radius={0.5} falloff={0.55} intensity={0.65} />
            </>
          )}

          {mood === 'beppu-steam' && (
            <>
              <ImageTexture url="/images/dest-beppu.png" objectFit="cover" />
              <CursorRipples intensity={7} decay={11} radius={0.32} chromaticSplit={0.5} />
              <Smoke
                colorA="#fde68a"
                colorB="#38bdf8"
                emitFrom={{ x: 0.5, y: 0.95 }}
                direction={0}
                speed={16 * speedMultiplier}
                spread={75}
                emitRadius={0.14}
                intensity={0.7}
                dissipation={0.25}
                detail={28}
                gravity={-0.3}
                mouseInfluence={0.6}
                mouseRadius={0.16}
                opacity={0.52}
                blendMode="screen"
              />
              <FloatingParticles
                count={650}
                speed={0.26 * speedMultiplier}
                angle={90}
                particleSize={1.25}
                softness={0.55}
                twinkle={0.6}
                particleColor="#bae6fd"
                cursorStrength={0.5}
                opacity={0.55}
                blendMode="screen"
              />
              {interactiveTrail && (
                <CursorTrail
                  colorA="#38bdf8"
                  colorB="#f59e0b"
                  radius={0.4}
                  length={0.5}
                  softness={0.5}
                  opacity={0.4}
                  blendMode="screen"
                />
              )}
              <Vignette color="#050811" radius={0.45} falloff={0.55} intensity={0.7} />
            </>
          )}

          {mood === 'hinoki-wgsl' && (
            <>
              <ImageTexture url="/images/bg-hero-onsen.png" objectFit="cover" />
              <CustomShader
                src={HinokiThermalWave}
                deepWater="#0b192c"
                mineralTeal="#1e5f74"
                hinokiAmber="#d97706"
                steamGlow="#fde68a"
                ringCount={6.5}
                speed={0.85 * speedMultiplier}
                opacity={0.52}
                blendMode="screen"
              />
              <FloatingParticles
                count={650}
                speed={0.2 * speedMultiplier}
                angle={90}
                particleSize={1.3}
                softness={0.7}
                twinkle={0.65}
                particleColor="#fde68a"
                cursorStrength={0.4}
                opacity={0.55}
                blendMode="screen"
              />
              {interactiveTrail && (
                <CursorTrail
                  colorA="#fef08a"
                  colorB="#f97316"
                  radius={0.4}
                  length={0.45}
                  softness={0.5}
                  opacity={0.4}
                  blendMode="screen"
                />
              )}
              <Vignette color="#070b14" radius={0.5} falloff={0.55} intensity={0.68} />
            </>
          )}
        </Shader>
      )}
    </div>
  )
}

interface DestinationShaderBannerProps {
  regionId: 'beppu-yufuin' | 'ureshino-takeo' | 'yufuin-fukuoka'
}

export const DEST_IMAGE_BY_REGION: Record<DestinationShaderBannerProps['regionId'], string> = {
  'beppu-yufuin': '/images/dest-beppu.png',
  'ureshino-takeo': '/images/dest-ureshino.png',
  'yufuin-fukuoka': '/images/dest-yufuin.png',
}

export const DestinationShaderBanner: React.FC<DestinationShaderBannerProps> = ({ regionId }) => {
  const [gpuOk, setGpuOk] = useState(true)
  const imgUrl = DEST_IMAGE_BY_REGION[regionId]

  return (
    <div
      className="relative w-full h-28 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('${imgUrl}')` }}
    >
      {gpuOk && (
        <Shader className="w-full h-full" onUnavailable={() => setGpuOk(false)}>
          <ImageTexture url={imgUrl} objectFit="cover" />
          <CursorRipples intensity={8} decay={10} radius={0.35} chromaticSplit={0.5} />
          <FloatingParticles
            count={260}
            speed={0.2}
            angle={90}
            particleSize={1.3}
            softness={0.6}
            particleColor="#fde68a"
            opacity={0.6}
            blendMode="screen"
          />
          <Vignette color="#090d16" radius={0.45} falloff={0.6} intensity={0.55} />
        </Shader>
      )}
    </div>
  )
}
