export interface ActiveBladeSlash {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  length: number;
  angle: number;
  life: number;
  maxLife: number;
}

/**
 * Actualiza y dibuja los tajos de katana estilo Fruit Ninja acelerados por hardware en GPU.
 */
export function drawBladeSlashes(
  ctx: CanvasRenderingContext2D,
  activeSlashes: ActiveBladeSlash[],
  dt: number
): void {
  for (let i = activeSlashes.length - 1; i >= 0; i--) {
    const slash = activeSlashes[i];
    slash.life -= dt;
    if (slash.life <= 0) {
      activeSlashes.splice(i, 1);
      continue;
    }

    const alpha = Math.max(0, Math.min(1, slash.life / slash.maxLife));
    const bladeWidth = 5;
    const halfW = bladeWidth / 2;
    const tipLen = Math.min(16, slash.length * 0.12);

    ctx.save();
    ctx.translate(slash.startX, slash.startY);
    ctx.rotate(slash.angle);
    ctx.globalAlpha = alpha;

    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(slash.length - tipLen, -halfW);
    ctx.lineTo(slash.length, 0);
    ctx.lineTo(slash.length - tipLen, halfW);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(slash.length, 0);
    ctx.stroke();

    ctx.restore();
  }
}
