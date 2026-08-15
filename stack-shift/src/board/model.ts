import type RAPIER from '@dimforge/rapier3d-compat';
import type * as THREE from 'three';

export type Piece = {
  id: number;
  mesh: THREE.Mesh;
  body: RAPIER.RigidBody;
  color: number;
  removing?: boolean;
};
