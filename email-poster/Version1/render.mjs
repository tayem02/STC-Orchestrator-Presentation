// Renders orchestrator-poster.html to a retina PNG and a single-page PDF.
// Driven by render.ps1, which provisions Puppeteer's Chrome-for-Testing build
// in a temp folder so the corporate Chrome policies don't interfere.
//
//   node render.mjs "<absolute path to orchestrator-poster.html>"

import puppeteer from "puppeteer";
import { pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";
import { copyFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";

const source = resolve(process.argv[2]);
const outDir = dirname(source);

// "orchestrator-poster.png" is the retina master; the 1x file is the one to drop
// into an email body, where a 2080 px-wide image is needlessly heavy.
const OUTPUTS = [
  { scale: 2, name: "orchestrator-poster.png" },
  { scale: 1, name: "orchestrator-poster-email.png" },
];

// The output folder lives in OneDrive, which intermittently locks files mid-sync,
// so render to a scratch folder and copy into place with a few retries.
const scratch = await mkdtemp(join(tmpdir(), "poster-out-"));

async function publish(name) {
  for (let attempt = 1; ; attempt++) {
    try {
      await copyFile(join(scratch, name), join(outDir, name));
      return join(outDir, name);
    } catch (error) {
      if (attempt >= 8) throw error;
      await new Promise((done) => setTimeout(done, 750 * attempt));
    }
  }
}

const browser = await puppeteer.launch({
  headless: true,
  args: ["--allow-file-access-from-files", "--font-render-hinting=none", "--force-color-profile=srgb"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1000, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(source).href, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);

  const box = await page.evaluate(() => {
    const rect = document.querySelector(".poster").getBoundingClientRect();
    return { width: Math.round(rect.width), height: Math.ceil(rect.height) };
  });
  console.log(`poster: ${box.width} x ${box.height} css px`);

  for (const { scale, name } of OUTPUTS) {
    await page.setViewport({ width: box.width, height: box.height, deviceScaleFactor: scale });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((done) => setTimeout(done, 400));
    const poster = await page.$(".poster");
    await poster.screenshot({ path: join(scratch, name), type: "png" });
  }

  // A single tall page, so the PDF is one continuous poster rather than slices.
  await page.pdf({
    path: join(scratch, "orchestrator-poster.pdf"),
    printBackground: true,
    width: `${box.width}px`,
    height: `${box.height + 1}px`,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    pageRanges: "1",
  });

  for (const { name } of OUTPUTS) console.log(`png:  ${await publish(name)}`);
  console.log(`pdf:  ${await publish("orchestrator-poster.pdf")}`);
} finally {
  await browser.close();
  await rm(scratch, { recursive: true, force: true });
}
