export type RootResource = 'MATTER' | 'ENERGY' | 'LIFE' | 'SIGNAL';

export type Inventory = Record<RootResource, number>;

export type ResourceNode = {
  id: string;
  resource: RootResource;
  amount: number;
  x: number;
  depleted: boolean;
  capacity?: number;
};

export type PushableObject = {
  id: string;
  x: number;
  minX: number;
  maxX: number;
};

export const createInventory = (): Inventory => ({ MATTER: 0, ENERGY: 0, LIFE: 0, SIGNAL: 0 });

export function gatherNode(node: ResourceNode, inventory: Inventory): boolean {
  if (node.depleted || node.amount <= 0) return false;
  node.capacity ??= node.amount;
  inventory[node.resource] += node.amount;
  node.amount = 0;
  node.depleted = true;
  return true;
}

export function restoreResourceNode(node: ResourceNode): boolean {
  if (!node.depleted) return false;
  const capacity = Math.max(1, node.capacity ?? node.amount);
  node.capacity = capacity;
  node.amount = capacity;
  node.depleted = false;
  return true;
}

export function pushObject(object: PushableObject, playerX: number, direction: -1 | 1, distance = 24): void {
  const playerOnLeft = playerX <= object.x;
  if ((direction === 1 && !playerOnLeft) || (direction === -1 && playerOnLeft)) return;
  object.x = Math.max(object.minX, Math.min(object.maxX, object.x + direction * distance));
}
