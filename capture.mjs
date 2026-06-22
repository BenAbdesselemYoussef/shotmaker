import { chromium } from "playwright";
import { mkdir, rm, readdir, rename } from "node:fs/promises";

const BASE = "http://localhost:4060";
const OUT = "media";
const VID = "media/video";
const VW = { width: 1440, height: 900 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(VID, { recursive: true });
  const browser = await chromium.launch();

  // ---- Screenshots ----
  const ctx = await browser.newContext({ viewport: VW, deviceScaleFactor: 2, colorScheme: "dark" });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForSelector("text=Establishing drone over the harbor");
  await sleep(700);
  await page.screenshot({ path: `${OUT}/01-storyboard.png` });

  // shot detail panel + fact assistant
  await page.getByText("Establishing drone over the harbor").click();
  await page.waitForSelector("text=Generate with AI");
  await page.getByRole("button", { name: "AI fact assistant" }).click();
  await sleep(500);
  await page.screenshot({ path: `${OUT}/02-shot-panel.png` });
  await page.keyboard.press("Escape");
  await sleep(400);

  // list view
  await page.getByRole("button", { name: "List", exact: true }).click();
  await sleep(500);
  await page.screenshot({ path: `${OUT}/03-list.png` });

  // back to storyboard, open AI ideas
  await page.getByRole("button", { name: "Storyboard", exact: true }).click();
  await sleep(300);
  await page.getByRole("button", { name: "AI shot ideas" }).click();
  await sleep(1500);
  await page.screenshot({ path: `${OUT}/04-ai-ideas.png` });
  await page.keyboard.press("Escape");
  await sleep(400);

  // second session (Nimbus, pink)
  await page.getByText("Nimbus Sneaker — Launch Teaser").click();
  await sleep(700);
  await page.screenshot({ path: `${OUT}/05-nimbus.png` });

  console.log("screenshots done");
  await ctx.close();

  // ---- Video ----
  const vctx = await browser.newContext({ viewport: VW, colorScheme: "dark", recordVideo: { dir: VID, size: VW } });
  const vp = await vctx.newPage();
  await vp.goto(BASE, { waitUntil: "networkidle" });
  await vp.waitForSelector("text=Establishing drone over the harbor");
  await sleep(1200);

  // drag a card to reorder
  try {
    const card = vp.getByText("Macro — texture of the material");
    const target = vp.getByText("Hero walks toward camera");
    const a = await card.boundingBox();
    const b = await target.boundingBox();
    if (a && b) {
      await vp.mouse.move(a.x + a.width / 2, a.y + 30);
      await vp.mouse.down();
      await sleep(200);
      for (let i = 1; i <= 14; i++) {
        await vp.mouse.move(a.x + ((b.x - a.x) * i) / 14 + 20, a.y + ((b.y - a.y) * i) / 14 + 30);
        await sleep(34);
      }
      await sleep(200);
      await vp.mouse.up();
    }
  } catch (e) {
    console.log("drag skipped:", e.message);
  }
  await sleep(1000);

  // open a shot, generate description with AI
  await vp.getByText("Close-up — hands wrap the product").click();
  await sleep(1200);
  await vp.getByRole("button", { name: "Generate with AI" }).click();
  await sleep(1800);
  await vp.getByRole("button", { name: "AI fact assistant" }).click();
  await sleep(1500);
  await vp.keyboard.press("Escape");
  await sleep(700);

  // list view
  await vp.getByRole("button", { name: "List", exact: true }).click();
  await sleep(1500);
  await vp.getByRole("button", { name: "Storyboard", exact: true }).click();
  await sleep(500);

  // AI shot ideas
  await vp.getByRole("button", { name: "AI shot ideas" }).click();
  await sleep(2000);
  try {
    await vp.getByRole("button", { name: "Add" }).first().click();
    await sleep(1000);
  } catch {}
  await vp.keyboard.press("Escape");
  await sleep(800);

  // switch session
  await vp.getByText("Makers — Documentary").click();
  await sleep(1800);

  await vctx.close();
  const files = await readdir(VID);
  const webm = files.find((f) => f.endsWith(".webm"));
  if (webm) await rename(`${VID}/${webm}`, `${VID}/shotmaker-walkthrough.webm`);
  console.log("video", webm ? "saved" : "MISSING");

  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
