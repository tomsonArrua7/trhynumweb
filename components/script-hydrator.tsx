"use client"

import { useEffect } from "react"

export function ScriptHydrator() {
  useEffect(() => {
    // Find script tags containing our logic
    const scripts = document.querySelectorAll("script");
    scripts.forEach((script) => {
      const content = script.textContent || "";
      if (content.includes("itemData") || content.includes("initCarousel")) {
        // To avoid double evaluation if it was somehow evaluated, check our flag
        if (!script.getAttribute("data-client-evaluated")) {
          console.log("[ScriptHydrator] Executing interactive scripts on client...");
          const newScript = document.createElement("script");
          newScript.textContent = content;
          newScript.setAttribute("data-client-evaluated", "true");
          script.parentNode?.replaceChild(newScript, script);
        }
      }
    });
  }, []);

  return null;
}
