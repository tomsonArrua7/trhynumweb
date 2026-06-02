import fs from "fs";
import path from "path";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { ScriptHydrator } from "@/components/script-hydrator";

export default function Home() {
  const filePath = path.join(process.cwd(), "index.html");
  const htmlContent = fs.readFileSync(filePath, "utf8");

  const [part1, part2] = htmlContent.split("<!-- REACT_SCREENSHOT_GALLERY_PLACEHOLDER -->");

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: part1 || "" }} />
      <ScreenshotGallery />
      <div dangerouslySetInnerHTML={{ __html: part2 || "" }} />
      <ScriptHydrator />
    </>
  );
}

