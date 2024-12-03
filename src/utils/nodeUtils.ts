let nodeCounter = 1;

export const generateNodeId = (): string => {
  return `node-${nodeCounter++}`;
};

export const calculateNewNodePosition = (
  parentNode: { position: { x: number; y: number } } | null,
  existingNodes: any[]
): { x: number; y: number } => {
  if (!parentNode) {
    return { x: 0, y: 0 };
  }

  const baseX = parentNode.position.x + 150;
  const baseY = parentNode.position.y + 100;

  // Avoid overlapping by checking existing positions
  let offset = 0;
  while (
    existingNodes.some(
      (node) =>
        Math.abs(node.position.x - (baseX + offset)) < 50 &&
        Math.abs(node.position.y - baseY) < 50
    )
  ) {
    offset += 50;
  }

  return { x: baseX + offset, y: baseY };
};