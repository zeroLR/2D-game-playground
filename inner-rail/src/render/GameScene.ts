import * as THREE from 'three';
import type { BallState } from '../physics/PhysicsWorld';
import { PHYSICS_CONFIG } from '../physics/physicsConfig';
import type { TrackProgressSnapshot } from '../track/TrackProgress';
import { VALIDATION_TRACK, type TrackPiece, type ValidationTrackDefinition } from '../track/TestTrack';

export class GameScene {
  readonly renderer: THREE.WebGLRenderer;

  private readonly scene = new THREE.Scene();
  private readonly shell: THREE.Mesh;
  private readonly reducedMotion: boolean;
  private readonly goalMaterial = new THREE.MeshStandardMaterial({
    color: 0x28544d,
    roughness: 0.38,
    metalness: 0.36,
    emissive: 0x173f38,
    emissiveIntensity: 0.85,
  });
  private readonly goalBeaconMaterial = new THREE.MeshStandardMaterial({
    color: 0xb8eadf,
    roughness: 0.3,
    metalness: 0.18,
    emissive: 0x5bc4ae,
    emissiveIntensity: 1.5,
    transparent: true,
    opacity: 0.84,
  });
  private readonly checkpointMarkers: THREE.Mesh[] = [];

  constructor(
    private readonly root: HTMLElement,
    private readonly track: ValidationTrackDefinition = VALIDATION_TRACK,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.className = 'game-canvas';
    this.root.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0x071015);
    this.scene.fog = new THREE.Fog(0x071015, 30, 88);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.addLighting();
    this.addTrackGeometry();
    this.addCheckpointMarkers();
    this.addGoalBeacon();
    this.shell = this.createInnerShell();
    this.scene.add(this.shell);
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height, false);
  }

  setTrackProgress(progress: TrackProgressSnapshot): void {
    const goalEnergy = progress.complete ? 3.2 : 0.85 + progress.goalHoldProgress * 1.8;
    this.goalMaterial.emissiveIntensity = goalEnergy;
    this.goalBeaconMaterial.emissiveIntensity = progress.complete ? 4.2 : 1.5 + progress.goalHoldProgress * 2.2;
    this.goalBeaconMaterial.opacity = progress.complete ? 1 : 0.84;

    for (let index = 0; index < this.checkpointMarkers.length; index += 1) {
      const material = this.checkpointMarkers[index].material as THREE.MeshBasicMaterial;
      material.opacity = index <= progress.checkpointIndex ? 0.62 : 0.18;
    }
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
    const hemisphere = new THREE.HemisphereLight(0xcde8e5, 0x071015, 1.35);
    this.scene.add(hemisphere);

    const key = new THREE.DirectionalLight(0xe6fff8, 2.25);
    key.position.set(-10, 20, -12);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0x6aa9b4, 0.9);
    fill.position.set(18, 10, 26);
    this.scene.add(fill);
  }

  private addTrackGeometry(): void {
    const trackMaterial = new THREE.MeshStandardMaterial({
      color: 0x17343a,
      roughness: 0.62,
      metalness: 0.3,
      emissive: 0x071719,
      emissiveIntensity: 0.42,
    });
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x8fd2c5,
      transparent: true,
      opacity: 0.34,
    });

    for (const piece of this.track.pieces) {
      const mesh = this.createTrackPieceMesh(piece, piece.surface === 'goal' ? this.goalMaterial : trackMaterial);
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry as THREE.BoxGeometry),
        edgeMaterial,
      );
      edges.renderOrder = 1;
      mesh.add(edges);
      this.scene.add(mesh);
    }
  }

  private createTrackPieceMesh(piece: TrackPiece, material: THREE.Material): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(piece.size.x, piece.size.y, piece.size.z),
      material,
    );
    mesh.position.set(piece.position.x, piece.position.y, piece.position.z);
    mesh.rotation.order = 'XYZ';
    mesh.rotation.set(piece.rotation.x, piece.rotation.y, piece.rotation.z);
    mesh.receiveShadow = false;
    return mesh;
  }

  private addCheckpointMarkers(): void {
    const geometry = new THREE.BoxGeometry(2.0, 0.025, 0.12);
    for (const checkpoint of this.track.checkpoints) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xb8eadf,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      });
      const marker = new THREE.Mesh(geometry, material);
      marker.position.set(checkpoint.pose.position.x, 0.035, checkpoint.pose.position.z);
      marker.rotation.y = checkpoint.pose.cameraYawRad;
      this.checkpointMarkers.push(marker);
      this.scene.add(marker);
    }
  }

  private addGoalBeacon(): void {
    const beacon = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.075, 10, 36),
      this.goalBeaconMaterial,
    );
    beacon.position.set(this.track.goal.center.x, 1.75, this.track.goal.center.z);
    beacon.rotation.y = Math.PI / 2;
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
