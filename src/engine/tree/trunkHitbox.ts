export interface Point2D {
  x: number;
  y: number;
}

export interface BoundaryResult {
  point: Point2D;
  normal: Point2D;
  distance: number;
}

export interface CollisionResolution {
  isColliding: boolean;
  clampedX: number;
  clampedY: number;
  normal: Point2D;
}

/**
 * Normalized polygon vertices [0, 1] outlining the main trunk and base roots
 * of the cherry blossom tree in imagen-fondo.webp.
 */
export const DEFAULT_TRUNK_POLYGON: Point2D[] = [
  { x: 0.58, y: 0.36 }, // Bifurcación superior central
  { x: 0.65, y: 0.38 }, // Bifurcación derecha superior
  { x: 0.67, y: 0.48 }, // Borde derecho tronco medio-alto
  { x: 0.69, y: 0.60 }, // Borde derecho tronco medio
  { x: 0.72, y: 0.72 }, // Curvatura hacia raíz derecha
  { x: 0.76, y: 0.84 }, // Base raíz derecha
  { x: 0.79, y: 0.95 }, // Extremo inferior derecho en suelo
  { x: 0.62, y: 0.95 }, // Extremo inferior izquierdo en suelo
  { x: 0.63, y: 0.82 }, // Raíz izquierda
  { x: 0.60, y: 0.68 }, // Borde izquierdo tronco medio
  { x: 0.57, y: 0.54 }, // Borde izquierdo tronco medio-alto
  { x: 0.55, y: 0.44 }, // Bifurcación izquierda
];

/**
 * Ray-casting algorithm to test if point is inside a polygon.
 */
export function isPointInPolygon(p: Point2D, polygon: Point2D[]): boolean {
  if (polygon.length < 3) return false;
  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect = yi > p.y !== yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi;
    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Finds the closest point on segment AB to point P.
 */
export function closestPointOnSegment(p: Point2D, a: Point2D, b: Point2D): Point2D {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const lenSq = abx * abx + aby * aby;

  if (lenSq === 0) {
    return { x: a.x, y: a.y };
  }

  const apx = p.x - a.x;
  const apy = p.y - a.y;
  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / lenSq));

  return {
    x: a.x + t * abx,
    y: a.y + t * aby,
  };
}

/**
 * Finds the closest point on the polygon boundary to P and computes
 * an outward-pointing unit normal vector.
 */
export function getClosestBoundaryPoint(p: Point2D, polygon: Point2D[]): BoundaryResult {
  let minDistance = Infinity;
  let closestPoint: Point2D = { x: p.x, y: p.y };
  let bestEdge = { a: polygon[0], b: polygon[1] };

  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % n];
    const candidate = closestPointOnSegment(p, a, b);
    const dist = Math.hypot(p.x - candidate.x, p.y - candidate.y);

    if (dist < minDistance) {
      minDistance = dist;
      closestPoint = candidate;
      bestEdge = { a, b };
    }
  }

  // Calculate perpendicular normal to the edge
  const edx = bestEdge.b.x - bestEdge.a.x;
  const edy = bestEdge.b.y - bestEdge.a.y;
  const edgeLen = Math.hypot(edx, edy) || 1;
  let nx = -edy / edgeLen;
  let ny = edx / edgeLen;

  // Test midpoint offset to ensure normal points outward (away from polygon interior)
  const midX = (bestEdge.a.x + bestEdge.b.x) / 2;
  const midY = (bestEdge.a.y + bestEdge.b.y) / 2;
  const testEpsilon = 1.0;
  if (isPointInPolygon({ x: midX + nx * testEpsilon, y: midY + ny * testEpsilon }, polygon)) {
    nx = -nx;
    ny = -ny;
  }

  return {
    point: closestPoint,
    normal: { x: nx, y: ny },
    distance: minDistance,
  };
}

/**
 * Projects normalized polygon [0, 1] onto viewport/screen DOMRect.
 */
export function denormalizePolygon(
  polygon: Point2D[],
  rect: { left: number; top: number; width: number; height: number }
): Point2D[] {
  return polygon.map((pt) => ({
    x: rect.left + pt.x * rect.width,
    y: rect.top + pt.y * rect.height,
  }));
}

/**
 * Checks if screen coordinates (x, y) collide with the trunk polygon.
 * If colliding, returns the clamped position on the bark perimeter and the outward normal.
 */
export function resolveTrunkCollision(
  x: number,
  y: number,
  screenPolygon: Point2D[],
  bufferMargin = 4
): CollisionResolution {
  const isInside = isPointInPolygon({ x, y }, screenPolygon);

  if (!isInside) {
    return {
      isColliding: false,
      clampedX: x,
      clampedY: y,
      normal: { x: 0, y: 0 },
    };
  }

  const boundary = getClosestBoundaryPoint({ x, y }, screenPolygon);

  // Push point slightly outward by bufferMargin pixels so it rests strictly outside the bark
  const clampedX = boundary.point.x + boundary.normal.x * bufferMargin;
  const clampedY = boundary.point.y + boundary.normal.y * bufferMargin;

  return {
    isColliding: true,
    clampedX,
    clampedY,
    normal: boundary.normal,
  };
}
