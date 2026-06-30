import { createServer } from "vite";

const server = await createServer({
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});

await server.listen();
server.printUrls();

process.on("SIGTERM", async () => {
  await server.close();
  process.exit(0);
});

setInterval(() => {}, 1_000_000);
