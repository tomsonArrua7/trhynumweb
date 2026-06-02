"use client"

import { useEffect } from "react"

export function ScriptHydrator() {
  useEffect(() => {
    // Find script tags containing our logic
    const scripts = document.querySelectorAll("script");
    scripts.forEach((script) => {
      const content = script.textContent || "";
      if (content.includes("itemData") || content.includes("initCarousel")) {
        // Prevent multiple client evaluations by setting a global window flag
        const win = window as any;
        if (!win.__script_evaluated) {
          console.log("[ScriptHydrator] Evaluating interactive scripts globally on document.body...");
          win.__script_evaluated = true;
          
          const newScript = document.createElement("script");
          newScript.textContent = content;
          newScript.setAttribute("data-client-evaluated", "true");
          document.body.appendChild(newScript);
        }
      }
    });
  }, []);

  return null;
}
