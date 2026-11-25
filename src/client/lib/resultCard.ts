import { ROLE_META } from '../../shared/heroes';
import type { Hero, HeroRanking } from '../../shared/types';

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function downloadResultCardPng(options: {
  champion: Hero;
  runnerUp: Hero | null;
  roundCount: number;
  winnerStats: HeroRanking | null;
  totalRuns: number;
}): Promise<void> {
  const { champion, runnerUp, roundCount, winnerStats, totalRuns } = options;

  const width = 1080;
  const height = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('브라우저 캔버스를 초기화할 수 없습니다.');
  }

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#090e1c');
  bg.addColorStop(0.5, '#0f172a');
  bg.addColorStop(1, '#060913');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Accent radial glow
  const glow = ctx.createRadialGradient(width / 2, 470, 40, width / 2, 470, 430);
  glow.addColorStop(0, `${champion.accentColor}66`);
  glow.addColorStop(0.55, `${champion.accentColor}1f`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Subtle top bar accent
  ctx.fillStyle = '#fa9c1e';
  ctx.fillRect(0, 0, width, 12);

  // Header brand
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fa9c1e';
  ctx.font = '700 28px "Chakra Petch", sans-serif';
  ctx.fillText('OW-TIER // OVERWATCH IDEAL TYPE WORLD CUP', width / 2, 86);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 54px "Noto Sans KR", sans-serif';
  ctx.fillText('나의 오버워치 여캐 최애 우승자', width / 2, 156);

  // Artwork container card
  const cardX = 160;
  const cardY = 210;
  const cardW = 760;
  const cardH = 620;

  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = champion.accentColor;
  ctx.stroke();
  ctx.clip();

  // Inner soft gradient
  const cardGlow = ctx.createRadialGradient(width / 2, cardY + 280, 30, width / 2, cardY + 280, 360);
  cardGlow.addColorStop(0, `${champion.accentColor}55`);
  cardGlow.addColorStop(1, 'rgba(15, 23, 42, 0.2)');
  ctx.fillStyle = cardGlow;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Load same-origin artwork first (prevents canvas taint)
  const img = await loadImage(champion.imageUrl);
  if (img) {
    const scale = Math.min((cardW - 80) / img.width, (cardH - 80) / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    ctx.drawImage(img, (width - drawW) / 2, cardY + (cardH - drawH) / 2, drawW, drawH);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 120px "Chakra Petch", sans-serif';
    ctx.fillText(champion.nameEn.slice(0, 2).toUpperCase(), width / 2, cardY + 340);
  }
  ctx.restore();

  // Champion crown pill
  const roleInfo = ROLE_META[champion.role];
  drawRoundedRect(ctx, width / 2 - 140, 864, 280, 50, 25);
  ctx.fillStyle = '#fa9c1e';
  ctx.fill();
  ctx.fillStyle = '#090e1c';
  ctx.font = '900 24px "Noto Sans KR", sans-serif';
  ctx.fillText(`CHAMPION · ${roleInfo.labelKo}`, width / 2, 898);

  // Champion Name
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 78px "Noto Sans KR", sans-serif';
  ctx.fillText(champion.nameKo, width / 2, 996);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 28px "Chakra Petch", sans-serif';
  ctx.fillText(champion.nameEn.toUpperCase(), width / 2, 1040);

  // Tagline
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 26px "Noto Sans KR", sans-serif';
  ctx.fillText(champion.tagline, width / 2, 1094);

  // Stats Footer Card
  drawRoundedRect(ctx, 110, 1140, width - 220, 140, 24);
  ctx.fillStyle = 'rgba(30, 41, 59, 0.78)';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.stroke();

  const cols = [
    { label: '진행 규모', value: `${roundCount}명 토너먼트` },
    {
      label: '결승 상대',
      value: runnerUp ? runnerUp.nameKo : '-',
    },
    {
      label: '전체 우승 비율',
      value:
        winnerStats && totalRuns > 0
          ? `${winnerStats.championshipRate.toFixed(1)}% (#${winnerStats.rank}위)`
          : '집계 완료',
    },
  ];

  cols.forEach((col, i) => {
    const colCenterX = 110 + ((width - 220) / 3) * (i + 0.5);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 22px "Noto Sans KR", sans-serif';
    ctx.fillText(col.label, colCenterX, 1192);

    ctx.fillStyle = i === 2 ? '#fa9c1e' : '#f8fafc';
    ctx.font = '700 30px "Noto Sans KR", sans-serif';
    ctx.fillText(col.value, colCenterX, 1244);
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((result) => resolve(result), 'image/png'),
  );
  if (!blob) {
    throw new Error('결과 카드 이미지를 생성하지 못했습니다.');
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ow-worldcup-${champion.id}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
