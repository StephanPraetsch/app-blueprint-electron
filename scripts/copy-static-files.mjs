import {cp, mkdir} from "node:fs/promises";

await mkdir("dist", { recursive: true });
await cp("src/index.html", "dist/index.html");
await cp("src/settings.html", "dist/settings.html");
await cp("src/styles.css", "dist/styles.css");
