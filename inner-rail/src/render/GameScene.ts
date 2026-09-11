import * as THREE from 'three';
import type { BallState } from '../physics/PhysicsWorld';
import { PHYSICS_CONFIG } from '../physics/physicsConfig';

export class GameScene {
  readonly renderer: THREE.WebGLRenderer;

  private readonly scene = new THREE.Scene();
  private readonly shell: THREE.Mesh;
  private readonly reducedMotion: boolean;

  constructor(private readonly root: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.className = 'game-canvas';
    this.root.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0x071015);
    this.scene.fog = new THREE.Fog(0x071015, 28, 76);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.addLighting();
    this.addSandboxGeometry();
    this.shell = this.createInnerShell();
    this.scene.add(this.shell);
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height, false);
  }

  render(camera: THREE.Camera, ballState: BallState): void {
    this.shell.visible = !this.reducedMotion;
    this.shell.position.set(ballState.position.x, ballState.position.y, ballState.position.z);
    this.shell.quaternion.set(
      ballState.quaternion.x,
      ballState.quaternion.y,
      ballState.quaternion.z,
      ballState.quaternion.w,
    );
    this.renderer.render(this.scene, camera);
  }

  destroy(): void {
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private addLighting(): void {
    const hemisphere = new THREE.HemisphereLight(0xcde8e5, 0x071015, 1.25);
    this.scene.add(hemisphere);

    const key = new THREE.DirectionalLight(0xe6fff8, 2.1);
    key.position.set(-8, 18, -10);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0x6aa9b4, 0.8);
    fill.position.set(10, 8, 18);
    this.scene.add(fill);
  }

  private addSandboxGeometry(): void {
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x13252b,
      roughness: 0.82,
      metalness: 0.18,
    });
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x17343a,
      roughness: 0.55,
      metalness: 0.32,
      emissive: 0x081517,
      emissiveIntensity: 0.45,
    });
    const guideMaterial = new THREE.MeshBasicMaterial({ color: 0x92d7ca, transparent: true, opacity: 0.38 });

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(
        PHYSICS_CONFIG.sandboxWidth,
        PHYSICS_CONFIG.floorThickness,
        PHYSICS_CONFIG.sandboxLength,
      ),
      floorMaterial,
    );
    floor.position.y = -PHYSICS_CONFIG.floorThickness / 2;
    this.scene.add(floor);

    const sideWallGeometry = new THREE.BoxGeometry(
      PHYSICS_CONFIG.wallThickness,
      PHYSICS_CONFIG.wallHeight,
      PHYSICS_CONFIG.sandboxLength,
    );
    const sideX = PHYSICS_CONFIG.sandboxWidth / 2 + PHYSICS_CONFIG.wallThickness / 2;
    for (const x of [-sideX, sideX]) {
      const wall = new THREE.Mesh(sideWallGeometry, wallMaterial);
      wall.position.set(x, PHYSICS_CONFIG.wallHeight / 2, 0);
      this.scene.add(wall);
    }

    const endWallGeometry = new THREE.BoxGeometry(
      PHYSICS_CONFIG.sandboxWidth,
      PHYSICS_CONFIG.wallHeight,
      PHYSICS_CONFIG.wallThickness,
    );
    const endZ = PHYSICS_CONFIG.sandboxLength / 2 + PHYSICS_CONFIG.wallThickness / 2;
    for (const z of [-endZ, endZ]) {
      const wall = new THREE.Mesh(endWallGeometry, wallMaterial);
      wall.position.set(0, PHYSICS_CONFIG.wallHeight / 2, z);
      this.scene.add(wall);
    }

    const edgeGeometry = new THREE.BoxGeometry(0.05, 0.025, PHYSICS_CONFIG.sandboxLength - 1);
    for (const x of [-PHYSICS_CONFIG.sandboxWidth * 0.32, PHYSICS_CONFIG.sandboxWidth * 0.32]) {
      const edge = new THREE.Mesh(edgeGeometry, guideMaterial);
      edge.position.set(x, 0.018, 0);
      this.scene.add(edge);
    }

    const markerGeometry = new THREE.BoxGeometry(PHYSICS_CONFIG.sandboxWidth * 0.56, 0.028, 0.06);
    for (let z = -20; z <= 20; z += 4) {
      const marker = new THREE.Mesh(markerGeometry, guideMaterial);
      marker.position.set(0, 0.02, z);
      this.scene.add(marker);
    }

    const beaconGeometry = new THREE.BoxGeometry(2.4, 0.035, 0.24);
    const beaconMaterial = new THREE.MeshBasicMaterial({ color: 0xdffcf5, transparent: true, opacity: 0.82 });
    const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
    beacon.position.set(0, 0.025, 18);
    this.scene.add(beacon);
  }

  private createInnerShell(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(PHYSICS_CONFIG.ballRadius * 0.98, 18, 12);
    const material = new THREE.MeshBasicMaterial({
      color: 0xb9eee2,
      transparent: true,
      opacity: 0.045,
      wireframe: true,
      side: THREE.BackSide,
      depthWrite: false,
    });
    return new THREE.Mesh(geometry, material);
  }
}
