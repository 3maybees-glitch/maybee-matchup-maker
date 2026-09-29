import { createServer } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

let code = 0;
try {
  const mod = await server.ssrLoadModule("/src/check.ts");
  const problems = mod.run();
  if (problems.length) {
    console.error(problems.join("\n"));
    code = 1;
  } else {
    console.log("self-check ok");
  }
} catch (error) {
  console.error(error);
  code = 1;
} finally {
  await server.close();
}
process.exit(code);
