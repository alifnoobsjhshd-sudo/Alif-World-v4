import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  MotionValue,
  useTransform,
  useSpring,
} from 'motion/react';
import * as THREE from 'three';

interface MarineFishProps {
  scrollVelocity: MotionValue<number>;
  smoothedDepth: MotionValue<number>;
}

interface FishParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
}

export const MarineFish: React.FC<MarineFishProps> = ({
  scrollVelocity,
  smoothedDepth,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<FishParticle[]>([]);
  const lastEmitRef = useRef<number>(0);

  // Depth-driven horizontal swim sway (organic S-curve travel across screen)
  const horizontalSwayRaw = useTransform(smoothedDepth, (d: number) => {
    const phase = ((d || 0) / 4400) * Math.PI;
    return Math.sin(phase) * 60;
  });
  const swayX = useSpring(horizontalSwayRaw, { stiffness: 65, damping: 22 });

  // Bank angle (rolls into turns like a real fish steering with water resistance)
  const bankRaw = useTransform(smoothedDepth, (d: number) => {
    const phase = ((d || 0) / 4400) * Math.PI;
    return Math.sin(phase) * -14;
  });
  const bank = useSpring(bankRaw, { stiffness: 85, damping: 22 });

  // Pitch reaction: dives forward into ocean depth during swim bursts
  const pitchRaw = useTransform(scrollVelocity, (v: number) => {
    const vel = v || 0;
    return Math.max(-12, Math.min(12, vel * 0.085));
  });
  const pitch = useSpring(pitchRaw, { stiffness: 95, damping: 22 });

  // ── Three.js High-Fidelity 3D Bioluminescent Fish Setup ──────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 170;
    const height = 170;

    const scene = new THREE.Scene();

    // Camera: positioned slightly behind & above, facing forwards into the depth
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.95, 3.2);
    camera.lookAt(0, 0.05, -0.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── Aquatic Lighting Setup ──────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x0284c7, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.5);
    keyLight.position.set(1.5, 4, 3);
    scene.add(keyLight);

    // Cyan bioluminescent underwater rim light
    const rimLight = new THREE.PointLight(0x06b6d4, 4.0, 9);
    rimLight.position.set(0, -1.2, -1.8);
    scene.add(rimLight);

    // Local pulsing glow light attached above the fish
    const fishGlowLight = new THREE.PointLight(0x38bdf8, 2.2, 5);
    fishGlowLight.position.set(0, 0.6, 0);
    scene.add(fishGlowLight);

    // ── 3D Fish Assembly ────────────────────────────────────────────────────
    const fishRoot = new THREE.Group();
    scene.add(fishRoot);

    // ── Premium Organic Shaders & Materials ──
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.45,
      roughness: 0.15,
      metalness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });

    const finMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.65,
      transparent: true,
      opacity: 0.82,
      roughness: 0.1,
      metalness: 0.05,
      transmission: 0.4,
      side: THREE.DoubleSide,
    });

    const finVeilMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.65,
      roughness: 0.12,
      side: THREE.DoubleSide,
    });

    const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
    });

    const irisMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });

    const pupilMaterial = new THREE.MeshStandardMaterial({
      color: 0x011627,
      roughness: 0.05,
    });

    // 1. Head & Torso Assembly (Smooth sculpted body)
    const torsoGroup = new THREE.Group();
    fishRoot.add(torsoGroup);

    // Mid-torso
    const torsoGeom = new THREE.SphereGeometry(0.52, 32, 24);
    torsoGeom.scale(0.60, 0.76, 1.35);
    const torsoMesh = new THREE.Mesh(torsoGeom, bodyMaterial);
    torsoGroup.add(torsoMesh);

    // Smooth tapered snout (head front)
    const headGeom = new THREE.ConeGeometry(0.31, 0.58, 28);
    headGeom.rotateX(-Math.PI / 2);
    const headMesh = new THREE.Mesh(headGeom, bodyMaterial);
    headMesh.position.set(0, -0.03, -0.92);
    torsoGroup.add(headMesh);

    // Rounded nose tip
    const noseTipGeom = new THREE.SphereGeometry(0.09, 16, 16);
    noseTipGeom.scale(1.2, 0.8, 1);
    const noseTip = new THREE.Mesh(noseTipGeom, bodyMaterial);
    noseTip.position.set(0, -0.04, -1.2);
    torsoGroup.add(noseTip);

    // Bioluminescent Spine Glow Line along the dorsal ridge
    const spineCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.12, -1.0),
      new THREE.Vector3(0, 0.38, -0.4),
      new THREE.Vector3(0, 0.40, 0.1),
      new THREE.Vector3(0, 0.28, 0.7),
    ]);
    const spineGeom = new THREE.TubeGeometry(spineCurve, 20, 0.018, 8, false);
    const spineMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const spineMesh = new THREE.Mesh(spineGeom, spineMat);
    torsoGroup.add(spineMesh);

    // 2. Eyes with glowing cyan iris and catchlights
    const eyeGeom = new THREE.SphereGeometry(0.088, 16, 16);
    const irisGeom = new THREE.SphereGeometry(0.065, 16, 16);
    const pupilGeom = new THREE.SphereGeometry(0.042, 16, 16);
    const catchlightGeom = new THREE.SphereGeometry(0.018, 8, 8);
    const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Left eye assembly
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.27, 0.12, -0.72);
    const leftEyeWhite = new THREE.Mesh(eyeGeom, eyeWhiteMaterial);
    const leftIris = new THREE.Mesh(irisGeom, irisMaterial);
    leftIris.position.set(-0.025, 0, -0.02);
    const leftPupil = new THREE.Mesh(pupilGeom, pupilMaterial);
    leftPupil.position.set(-0.045, 0, -0.035);
    const leftCatchlight = new THREE.Mesh(catchlightGeom, catchlightMat);
    leftCatchlight.position.set(-0.065, 0.025, -0.04);
    leftEyeGroup.add(leftEyeWhite, leftIris, leftPupil, leftCatchlight);
    torsoGroup.add(leftEyeGroup);

    // Right eye assembly
    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.27, 0.12, -0.72);
    const rightEyeWhite = new THREE.Mesh(eyeGeom, eyeWhiteMaterial);
    const rightIris = new THREE.Mesh(irisGeom, irisMaterial);
    rightIris.position.set(0.025, 0, -0.02);
    const rightPupil = new THREE.Mesh(pupilGeom, pupilMaterial);
    rightPupil.position.set(0.045, 0, -0.035);
    const rightCatchlight = new THREE.Mesh(catchlightGeom, catchlightMat);
    rightCatchlight.position.set(0.065, 0.025, -0.04);
    rightEyeGroup.add(rightEyeWhite, rightIris, rightPupil, rightCatchlight);
    torsoGroup.add(rightEyeGroup);

    // 3. Arched Dorsal Fin (Graceful crested spine fin)
    const dorsalPivot = new THREE.Group();
    dorsalPivot.position.set(0, 0.38, 0.15);
    torsoGroup.add(dorsalPivot);

    const dorsalShape = new THREE.Shape();
    dorsalShape.moveTo(0, 0);
    dorsalShape.quadraticCurveTo(-0.08, 0.44, -0.38, 0.56);
    dorsalShape.quadraticCurveTo(-0.72, 0.42, -0.92, 0.05);
    dorsalShape.quadraticCurveTo(-0.45, 0.12, 0, 0);
    const dorsalGeom = new THREE.ShapeGeometry(dorsalShape);
    dorsalGeom.rotateY(Math.PI / 2);
    const dorsalMesh = new THREE.Mesh(dorsalGeom, finMaterial);
    dorsalPivot.add(dorsalMesh);

    // 4. Pectoral Fins (Fan-shaped gossamer wings that curl & flap)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.quadraticCurveTo(0.25, -0.04, 0.48, -0.22);
    finShape.quadraticCurveTo(0.42, -0.42, 0.15, -0.38);
    finShape.quadraticCurveTo(0.05, -0.25, 0, 0);
    const finGeom = new THREE.ShapeGeometry(finShape);

    // Left pectoral fin
    const leftFinPivot = new THREE.Group();
    leftFinPivot.position.set(-0.31, -0.06, -0.32);
    leftFinPivot.rotation.y = -Math.PI / 3.6;
    leftFinPivot.rotation.x = 0.22;
    const leftFinMesh = new THREE.Mesh(finGeom, finMaterial);
    leftFinMesh.rotation.y = Math.PI;
    leftFinPivot.add(leftFinMesh);
    torsoGroup.add(leftFinPivot);

    // Right pectoral fin
    const rightFinPivot = new THREE.Group();
    rightFinPivot.position.set(0.31, -0.06, -0.32);
    rightFinPivot.rotation.y = Math.PI / 3.6;
    rightFinPivot.rotation.x = 0.22;
    const rightFinMesh = new THREE.Mesh(finGeom, finMaterial);
    rightFinPivot.add(rightFinMesh);
    torsoGroup.add(rightFinPivot);

    // 5. Double-Articulated Tail Peduncle & Flowing Caudal Silk Veil Fin
    // Joint 1: Tail Base
    const tailBasePivot = new THREE.Group();
    tailBasePivot.position.set(0, 0, 0.65);
    fishRoot.add(tailBasePivot);

    const peduncleGeom = new THREE.ConeGeometry(0.22, 0.62, 22);
    peduncleGeom.rotateX(Math.PI / 2);
    const peduncleMesh = new THREE.Mesh(peduncleGeom, bodyMaterial);
    peduncleMesh.position.set(0, 0, 0.31);
    tailBasePivot.add(peduncleMesh);

    // Joint 2: Mid-Tail
    const tailMidPivot = new THREE.Group();
    tailMidPivot.position.set(0, 0, 0.62);
    tailBasePivot.add(tailMidPivot);

    // Caudal Fin Main Silk Veil (Upper & Lower crescent lobes)
    const caudalShape = new THREE.Shape();
    caudalShape.moveTo(0, 0);
    caudalShape.quadraticCurveTo(0.18, 0.48, 0.52, 0.72);
    caudalShape.quadraticCurveTo(0.24, 0.32, 0.08, 0.06);
    caudalShape.quadraticCurveTo(0.24, -0.32, 0.52, -0.72);
    caudalShape.quadraticCurveTo(0.18, -0.48, 0, 0);
    const caudalGeom = new THREE.ShapeGeometry(caudalShape);
    caudalGeom.rotateY(Math.PI / 2);
    const caudalMesh = new THREE.Mesh(caudalGeom, finMaterial);
    tailMidPivot.add(caudalMesh);

    // Joint 3: Trailing gossamer veil extension for wave lag
    const tailTipPivot = new THREE.Group();
    tailTipPivot.position.set(0, 0, 0.35);
    tailMidPivot.add(tailTipPivot);

    const veilShape = new THREE.Shape();
    veilShape.moveTo(0, 0);
    veilShape.quadraticCurveTo(0.14, 0.38, 0.42, 0.58);
    veilShape.quadraticCurveTo(0.22, 0.24, 0.06, 0.04);
    veilShape.quadraticCurveTo(0.22, -0.24, 0.42, -0.58);
    veilShape.quadraticCurveTo(0.14, -0.38, 0, 0);
    const veilGeom = new THREE.ShapeGeometry(veilShape);
    veilGeom.rotateY(Math.PI / 2);
    const veilMesh = new THREE.Mesh(veilGeom, finVeilMaterial);
    tailTipPivot.add(veilMesh);

    // ── Continuous High-Fidelity Physics Animation Loop ─────────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animateLoop = () => {
      const elapsed = clock.getElapsedTime();
      const vel = Math.abs(scrollVelocity.get() || 0);

      // Swimming frequency surges organically with velocity
      // Cruising idle: ~2.8 Hz -> Rapid propulsion: up to ~8.2 Hz
      const swimFreq = 2.8 + Math.min(5.4, vel * 0.065);
      const tailAmp = 0.25 + Math.min(0.38, vel * 0.0045);
      const tailPhase = elapsed * swimFreq;

      // 1. S-Curve Spine Locomotion with Natural Wave Delay
      // Head counter-turn
      torsoGroup.rotation.y = Math.sin(tailPhase + 0.6) * 0.055;
      // Dorsal fin fluid ripple
      dorsalPivot.rotation.z = Math.sin(tailPhase) * 0.12;

      // Tail Joint 1: Base stroke
      tailBasePivot.rotation.y = Math.sin(tailPhase) * tailAmp;
      // Tail Joint 2: Mid-peduncle wave lag
      tailMidPivot.rotation.y = Math.sin(tailPhase - 0.7) * (tailAmp * 1.35);
      // Tail Joint 3: Flowing gossamer veil whip
      tailTipPivot.rotation.y = Math.sin(tailPhase - 1.4) * (tailAmp * 0.85);

      // 2. Pectoral Fin Water-Resistance Flapping
      const leftStroke = Math.sin(tailPhase * 0.85);
      const rightStroke = -leftStroke;
      leftFinPivot.rotation.z = leftStroke * 0.28;
      leftFinPivot.rotation.x = 0.22 + Math.cos(tailPhase * 0.85) * 0.16;

      rightFinPivot.rotation.z = rightStroke * 0.28;
      rightFinPivot.rotation.x = 0.22 - Math.cos(tailPhase * 0.85) * 0.16;

      // 3. Bioluminescent Breathing Pulse
      const pulse = 0.45 + Math.sin(elapsed * 2.2) * 0.15;
      bodyMaterial.emissiveIntensity = pulse;
      finMaterial.emissiveIntensity = pulse + 0.2;
      fishGlowLight.intensity = 1.8 + Math.sin(elapsed * 2.2) * 0.6;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animateLoop);
    };

    animateLoop();

    // ── Safe Cleanup on Unmount ─────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      torsoGeom.dispose();
      headGeom.dispose();
      noseTipGeom.dispose();
      spineGeom.dispose();
      eyeGeom.dispose();
      irisGeom.dispose();
      pupilGeom.dispose();
      catchlightGeom.dispose();
      dorsalGeom.dispose();
      finGeom.dispose();
      peduncleGeom.dispose();
      caudalGeom.dispose();
      veilGeom.dispose();
      bodyMaterial.dispose();
      finMaterial.dispose();
      finVeilMaterial.dispose();
      eyeWhiteMaterial.dispose();
      irisMaterial.dispose();
      pupilMaterial.dispose();
      catchlightMat.dispose();
      spineMat.dispose();
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [scrollVelocity]);

  // Trailing wake bubbles when actively swimming
  useEffect(() => {
    let animId: number;
    const emitLoop = () => {
      const vel = Math.abs(scrollVelocity.get() || 0);
      const now = performance.now();
      if (vel > 14 && now - lastEmitRef.current > (110 - Math.min(65, vel * 0.5))) {
        lastEmitRef.current = now;
        const newParticle: FishParticle = {
          id: Math.random(),
          x: (Math.random() - 0.5) * 14,
          y: 24 + Math.random() * 8,
          size: 2.5 + Math.random() * 3.5,
          color: Math.random() > 0.4 ? '#38bdf8' : '#67e8f9',
          opacity: 0.85,
        };
        setParticles((prev) => [...prev.slice(-12), newParticle]);
      }
      animId = requestAnimationFrame(emitLoop);
    };
    animId = requestAnimationFrame(emitLoop);
    return () => cancelAnimationFrame(animId);
  }, [scrollVelocity]);

  // Clean expired wake bubbles
  useEffect(() => {
    if (particles.length === 0) return;
    const t = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 750);
    return () => clearTimeout(t);
  }, [particles]);

  return (
    <div
      className="fixed pointer-events-none select-none z-50"
      style={{
        left: '50%',
        bottom: '8.0%',
        transform: 'translateX(-50%)',
      }}
    >
      <motion.div
        style={{
          x: swayX,
          rotateZ: bank,
          rotateX: pitch,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: [-4, 4, -4],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center will-change-transform"
      >
        {/* Bioluminescent Aqua Glow Halo around 3D Fish */}
        <div className="absolute w-16 h-16 rounded-full bg-cyan-400/25 blur-lg pointer-events-none animate-pulse" />
        <div className="absolute w-12 h-12 rounded-full bg-blue-500/20 blur-md pointer-events-none" />

        {/* Trailing Bioluminescent Wake Particles & Bubbles */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ scale: 0.3, opacity: p.opacity, y: p.y, x: p.x }}
              animate={{
                scale: 1.4,
                opacity: 0,
                y: p.y + 36 + Math.random() * 20,
                x: p.x + (Math.random() - 0.5) * 16,
              }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
              }}
              className="rounded-full backdrop-blur-xs border border-white/60"
            />
          ))}
        </div>

        {/* ── 3D THREE.JS CANVAS CONTAINER (Facing Forwards into Ocean) ── */}
        <div
          ref={mountRef}
          className="relative w-full h-full flex items-center justify-center pointer-events-none drop-shadow-[0_8px_20px_rgba(2,132,199,0.7)]"
        />

        {/* Ambient Water Shimmer beneath Fish */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-1 w-20 h-4 rounded-full border border-cyan-400/30 blur-xs pointer-events-none"
        />
      </motion.div>
    </div>
  );
};
