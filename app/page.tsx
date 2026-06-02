import fs from "fs";
import path from "path";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { ScriptHydrator } from "@/components/script-hydrator";

export default function Home() {
  const filePath = path.join(process.cwd(), "index.html");
  const htmlContent = fs.readFileSync(filePath, "utf8");

  // Extract head contents (between <head> and </head>)
  const headMatch = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headInner = headMatch ? headMatch[1] : "";

  // Extract body contents (between <body ...> and </body>)
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyInner = bodyMatch ? bodyMatch[1] : htmlContent;

  const [part1, part2] = bodyInner.split("<!-- REACT_SCREENSHOT_GALLERY_PLACEHOLDER -->");

  return (
    <>
      {/* Inject head styles and links so fonts and styles load correctly */}
      <div dangerouslySetInnerHTML={{ __html: headInner }} />
      
      {/* Inject body parts around the native React gallery */}
      <div dangerouslySetInnerHTML={{ __html: part1 || "" }} />
      <ScreenshotGallery />
      <div dangerouslySetInnerHTML={{ __html: part2 || "" }} />
      <ScriptHydrator />
    </>
  );
}


