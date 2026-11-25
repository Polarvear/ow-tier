import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const heroesSourcePath = path.join(rootDir, 'src', 'shared', 'heroes.ts');
const outputDir = path.join(rootDir, 'public', 'images', 'heroes');

async function main() {
  const source = await fs.readFile(heroesSourcePath, 'utf8');
  const pattern = /id:\s*'([^']+)'[\s\S]*?sourceArtworkUrl:\s*\n?\s*'([^']+)'/g;
  const entries = [...source.matchAll(pattern)].map((match) => ({
    id: match[1],
    url: match[2],
  }));

  if (entries.length === 0) {
    throw new Error('영웅 아트워크 URL을 찾지 못했습니다.');
  }

  await fs.mkdir(outputDir, { recursive: true });
  console.log(`Downloading ${entries.length} official Overwatch hero artworks...`);

  let success = 0;
  await Promise.all(
    entries.map(async ({ id, url }) => {
      const targetPath = path.join(outputDir, `${id}.png`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${id}: HTTP ${response.status}`);
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(targetPath, buffer);
      success += 1;
    }),
  );

  console.log(`Done! Saved ${success}/${entries.length} artworks to public/images/heroes/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
