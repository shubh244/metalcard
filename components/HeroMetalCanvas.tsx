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
import { useIsMobile } from "@/hooks/useIsMobile";

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

function emboss(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fill = "#e2e6ec",
  align: CanvasTextAlign = "left"
) {
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillText(text, x + 2, y + 3);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillText(text, x - 1.2, y - 1.4);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
  ctx.textAlign = "left";
}

function createFaceTexture() {
  const W = 2048;
  const H = 1292;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Readable graphite metal (not near-black)
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#4a5160");
  g.addColorStop(0.35, "#2a303a");
  g.addColorStop(0.7, "#1a1e26");
  g.addColorStop(1, "#12151c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < H; i += 2) {
    ctx.fillStyle =
      i % 4 === 0 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
    ctx.fillRect(0, i, W, 1);
  }

  const sheen = ctx.createLinearGradient(0, 0, W, H);
  sheen.addColorStop(0.25, "rgba(255,255,255,0)");
  sheen.addColorStop(0.45, "rgba(255,255,255,0.16)");
  sheen.addColorStop(0.6, "rgba(255,255,255,0.03)");
  sheen.addColorStop(0.85, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 4;
  roundRect(ctx, 20, 20, W - 40, H - 40, 48);
  ctx.stroke();

  const m = 120;
  const muted = "#b8c0ca";
  const bright = "#eef1f5";

  // Bank
  ctx.font = "700 36px Arial, Helvetica, sans-serif";
  let bx = m;
  for (const ch of "HDFC BANK") {
    emboss(ctx, ch, bx, 130, muted);
    bx += ctx.measureText(ch).width + 7;
  }

  // Chip
  const cx = m;
  const cy = 250;
  const cw = 112;
  const ch = 88;
  const chipG = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
  chipG.addColorStop(0, "#f8ecc0");
  chipG.addColorStop(0.45, "#d4af37");
  chipG.addColorStop(1, "#7a5a1c");
  ctx.fillStyle = chipG;
  roundRect(ctx, cx, cy, cw, ch, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.45)";
  ctx.lineWidth = 2;
  roundRect(ctx, cx, cy, cw, ch, 12);
  ctx.stroke();
  ctx.strokeStyle = "rgba(60,40,10,0.55)";
  ctx.lineWidth = 2;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      roundRect(ctx, cx + 14 + col * 28, cy + 14 + row * 30, 24, 26, 3);
      ctx.stroke();
    }
  }

  // Contactless
  ctx.strokeStyle = muted;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(m + 170, 300, 14 + i * 14, -Math.PI * 0.55, -Math.PI * 0.12);
    ctx.stroke();
  }

  // PAN
  ctx.font = "700 76px 'Courier New', monospace";
  const pan = "5412883401927741";
  let px = m;
  for (let i = 0; i < 16; i++) {
    emboss(ctx, pan[i], px, 560, bright);
    px += 54;
    if ((i + 1) % 4 === 0) px += 34;
  }

  // Valid thru
  ctx.font = "600 22px Arial, Helvetica, sans-serif";
  emboss(ctx, "VALID", m, 655, "rgba(180,186,194,0.65)");
  emboss(ctx, "THRU", m, 682, "rgba(180,186,194,0.65)");
  ctx.font = "700 44px 'Courier New', monospace";
  emboss(ctx, "12/29", m + 110, 678, bright);

  // Name
  ctx.font = "700 48px Arial, Helvetica, sans-serif";
  let nx = m;
  for (const ch of "INFINIA METAL") {
    emboss(ctx, ch, nx, H - 170, bright);
    nx += ctx.measureText(ch).width + 3;
  }

  // Visa
  ctx.font = "italic 800 58px Arial, Helvetica, sans-serif";
  emboss(ctx, "VISA", W - m, H - 145, bright, "right");
  const bar = ctx.createLinearGradient(W - m - 120, H - 120, W - m, H - 120);
  bar.addColorStop(0, "#1a1f71");
  bar.addColorStop(0.5, "#f7b600");
  bar.addColorStop(1, "#1a1f71");
  ctx.fillStyle = bar;
  ctx.fillRect(W - m - 118, H - 125, 118, 5);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
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
    const tx = reduced ? -0.22 : pointer.current.y * 0.55 - 0.22;
    const ty = reduced ? -0.4 : pointer.current.x * 0.7 - 0.4;
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
    <group ref={group} rotation={[-0.22, -0.4, -0.1]} scale={1.05}>
      {/* Thickness / edge */}
      <RoundedBox args={[3.4, 2.14, 0.07]} radius={0.1} smoothness={6}>
        <meshStandardMaterial color="#0d0f14" metalness={0.8} roughness={0.35} />
      </RoundedBox>

      {/* Front face — BasicMaterial so texture never washes to black/white */}
      <mesh position={[0, 0, 0.038]}>
        <planeGeometry args={[3.28, 2.04]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>

      {/* Soft clearcoat plate for specular glints without killing albedo */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[3.28, 2.04]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          metalness={0.9}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={0.6}
          depthWrite={false}
        />
      </mesh>
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
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 3]} intensity={1.1} color="#ffffff" />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.35}
        color="#b8a06a"
      />
      <Float
        speed={reduced ? 0 : 1.4}
        rotationIntensity={reduced ? 0 : 0.2}
        floatIntensity={reduced ? 0 : 0.4}
      >
        <CardMesh pointer={pointer} reduced={reduced} map={map} />
      </Float>
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.5}
        scale={7}
        blur={2.5}
        far={3}
      />
      <Environment preset="apartment" environmentIntensity={0.25} />
    </>
  );
}

type Props = {
  className?: string;
  pointer: MutableRefObject<Pointer>;
};

export function HeroMetalCanvas({ className = "", pointer }: Props) {
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const [ready, setReady] = useState(false);
  const map = useMemo(() => {
    if (typeof document === "undefined") return null;
    try {
      return createFaceTexture();
    } catch {
      return null;
    }
  }, []);

  useLayoutEffect(() => {
    setReady(true);
    return () => {
      map?.dispose();
    };
  }, [map]);

  // Mobile / no-WebGL fallback
  if (!ready || mobile || !map) {
    return (
      <div className={`flex h-full w-full items-center justify-center ${className}`}>
        <MetalCard
          card={{
            name: "Infinia Metal",
            bankName: "HDFC Bank",
            network: "Visa",
            metalTone: "obsidian",
            variant: "Metal",
          }}
          size="hero"
          interactive={!mobile && !reduced}
          float={!reduced}
          className="!max-w-[360px] sm:!max-w-[400px]"
        />
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.15, 4.4], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <Suspense fallback={null}>
          <Scene pointer={pointer} reduced={reduced} map={map} />
        </Suspense>
      </Canvas>
    </div>
  );
}
