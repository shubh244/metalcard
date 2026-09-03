"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  RoundedBox,
} from "@react-three/drei";
import {
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { MetalCard } from "./MetalCard";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export type Pointer = { x: number; y: number };

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function softText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fill: string,
  align: CanvasTextAlign = "left"
) {
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillText(text, x + 1, y + 1.5);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
  ctx.textAlign = "left";
}

/** Clean fintech card face — masked PAN, placeholders only */
function createFaceTexture() {
  const W = 2048;
  const H = 1292; // ISO ID-1 ratio
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Soft graphite metal
  const base = ctx.createLinearGradient(0, 0, W, H);
  base.addColorStop(0, "#3e4552");
  base.addColorStop(0.4, "#252a33");
  base.addColorStop(0.75, "#171b22");
  base.addColorStop(1, "#12151b");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // Subtle brush
  for (let i = 0; i < H; i += 2) {
    ctx.fillStyle =
      i % 4 === 0 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.025)";
    ctx.fillRect(0, i, W, 1);
  }

  // Soft diagonal reflection
  const sheen = ctx.createLinearGradient(0, 0, W, H);
  sheen.addColorStop(0.3, "rgba(255,255,255,0)");
  sheen.addColorStop(0.45, "rgba(255,255,255,0.12)");
  sheen.addColorStop(0.55, "rgba(255,255,255,0.03)");
  sheen.addColorStop(0.75, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, W, H);

  // Quiet edge
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 3;
  roundRect(ctx, 24, 24, W - 48, H - 48, 48);
  ctx.stroke();

  const m = 140;
  const muted = "rgba(200,205,212,0.72)";
  const bright = "rgba(232,236,241,0.92)";

  // Issuer placeholder
  ctx.font = "600 34px Arial, Helvetica, sans-serif";
  softText(ctx, "CARDFORGE", m, 150, muted);

  // EMV chip
  const cx = m;
  const cy = 280;
  const cw = 108;
  const ch = 84;
  const chip = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
  chip.addColorStop(0, "#f0dfb0");
  chip.addColorStop(0.45, "#c9a24a");
  chip.addColorStop(1, "#7a5c22");
  ctx.fillStyle = chip;
  roundRect(ctx, cx, cy, cw, ch, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 2;
  roundRect(ctx, cx, cy, cw, ch, 12);
  ctx.stroke();
  ctx.strokeStyle = "rgba(70,50,15,0.45)";
  ctx.lineWidth = 1.8;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      roundRect(ctx, cx + 14 + col * 28, cy + 14 + row * 28, 24, 24, 3);
      ctx.stroke();
    }
  }

  // Contactless
  ctx.strokeStyle = muted;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(m + 168, 328, 12 + i * 13, -Math.PI * 0.55, -Math.PI * 0.15);
    ctx.stroke();
  }

  // Masked number
  ctx.font = "600 72px 'Courier New', monospace";
  softText(ctx, "••••  ••••  ••••  4821", m, 600, bright);

  // Expiry placeholder
  ctx.font = "500 22px Arial, Helvetica, sans-serif";
  softText(ctx, "VALID THRU", m, 700, "rgba(180,186,194,0.55)");
  ctx.font = "600 40px 'Courier New', monospace";
  softText(ctx, "••/••", m, 755, bright);

  // Cardholder placeholder
  ctx.font = "600 40px Arial, Helvetica, sans-serif";
  softText(ctx, "CARDHOLDER NAME", m, H - 160, bright);

  // Generic network mark (not a real logo)
  ctx.font = "700 48px Arial, Helvetica, sans-serif";
  softText(ctx, "PAY", W - m, H - 170, bright, "right");
  const mark = ctx.createLinearGradient(W - m - 90, H - 145, W - m, H - 145);
  mark.addColorStop(0, "rgba(184,160,106,0.85)");
  mark.addColorStop(1, "rgba(200,205,212,0.5)");
  ctx.fillStyle = mark;
  ctx.fillRect(W - m - 88, H - 148, 88, 5);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 12;
  texture.needsUpdate = true;
  return texture;
}

function CardMesh({
  pointer,
  reduced,
  map,
}: {
  pointer: MutableRefObject<Pointer>;
  reduced: boolean;
  map: THREE.CanvasTexture;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const tx = reduced ? -0.2 : pointer.current.y * 0.4 - 0.2;
    const ty = reduced ? -0.35 : pointer.current.x * 0.55 - 0.35;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      tx,
      0.07
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      ty,
      0.07
    );
  });

  return (
    <group ref={group} rotation={[-0.2, -0.35, -0.08]} scale={1.05}>
      <RoundedBox
        args={[3.375, 2.125, 0.1]}
        radius={0.1}
        smoothness={8}
      >
        <meshPhysicalMaterial
          map={map}
          metalness={0.55}
          roughness={0.38}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          envMapIntensity={0.75}
          reflectivity={0.7}
        />
      </RoundedBox>
      {/* Thin metal rim */}
      <RoundedBox
        args={[3.39, 2.14, 0.05]}
        radius={0.1}
        smoothness={6}
        position={[0, 0, -0.03]}
      >
        <meshStandardMaterial
          color="#6a7280"
          metalness={0.9}
          roughness={0.3}
        />
      </RoundedBox>
    </group>
  );
}

function Scene({
  pointer,
  reduced,
  map,
}: {
  pointer: MutableRefObject<Pointer>;
  reduced: boolean;
  map: THREE.CanvasTexture;
}) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 3]} intensity={1.15} color="#f4f6f8" />
      <directionalLight
        position={[-3, 1.5, -2]}
        intensity={0.3}
        color="#b8a06a"
      />
      <Float
        speed={reduced ? 0 : 1.2}
        rotationIntensity={0}
        floatIntensity={reduced ? 0 : 0.28}
      >
        <CardMesh pointer={pointer} reduced={reduced} map={map} />
      </Float>
      <ContactShadows
        position={[0, -1.25, 0]}
        opacity={0.45}
        scale={7}
        blur={2.6}
        far={3}
      />
      <Environment preset="apartment" environmentIntensity={0.55} />
    </>
  );
}

type Props = {
  className?: string;
  pointer: MutableRefObject<Pointer>;
};

export function HeroMetalCanvas({ className = "", pointer }: Props) {
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  const map = useMemo(() => {
    if (typeof document === "undefined") return null;
    try {
      return createFaceTexture();
    } catch {
      return null;
    }
  }, []);

  useLayoutEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    setMounted(true);
    return () => {
      map?.dispose();
    };
  }, [map]);

  // SSR / first paint — empty shell (no flat card flash)
  if (!mounted) {
    return <div className={`h-full w-full ${className}`} aria-hidden />;
  }

  // Mobile only — CSS card (no WebGL swap)
  if (isMobile || !map) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${className}`}
      >
        <MetalCard
          card={{
            name: "Cardholder Name",
            bankName: "CardForge",
            network: "Visa",
            metalTone: "obsidian",
            variant: "Metal",
          }}
          size="hero"
          interactive={!reduced}
          float={!reduced}
          className="!max-w-[380px] sm:!max-w-[420px]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative h-full w-full transition-opacity duration-500 ease-out ${className}`}
      style={{ opacity: sceneReady ? 1 : 0 }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0.15, 0.2, 4.3], fov: 30 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          requestAnimationFrame(() => setSceneReady(true));
        }}
      >
        <Suspense fallback={null}>
          <Scene pointer={pointer} reduced={reduced} map={map} />
        </Suspense>
      </Canvas>
    </div>
  );
}


