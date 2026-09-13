import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("public/images", { recursive: true });
const sources = [
  ["C:/Users/SnyX/AppData/Local/Temp/codex-clipboard-847263f4-7b1c-4670-afe0-76a31418ae55.png", "garage-101-original"],
  ["C:/Users/SnyX/AppData/Local/Temp/codex-clipboard-7b812b6b-bcb9-4ef9-8316-c3381574e432.png", "polimento-original"],
  ["C:/Users/SnyX/AppData/Local/Temp/codex-clipboard-2ba585cb-eaf3-44aa-b0e4-e850b116b98b.png", "higienizacao-original"],
];
for (const [source, name] of sources) {
  await sharp(source).webp({ quality: 87 }).toFile(`public/images/${name}.webp`);
  console.log(`${name}.webp saved`);
}
