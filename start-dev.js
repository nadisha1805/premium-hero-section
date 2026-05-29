import { spawn } from "child_process";
import http from "http";

const port = 8081;

console.log("🚀 Initializing Tunnelmole secure tunnel...");

// 1. Create a dummy HTTP server on the target port
const dummyServer = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Dummy Server");
});

dummyServer.listen(port, () => {
  console.log(`[system] Temporary dummy server listening on port ${port} to initialize tunnel...`);

  // 2. Start tunnelmole using npx
  const tmoleProcess = spawn("npx", ["tunnelmole", port.toString()], {
    shell: true,
    stdio: "pipe"
  });

  let shopifyProcess = null;
  let urlCaptured = false;

  tmoleProcess.stdout.on("data", (data) => {
    const output = data.toString();
    console.log(`[tunnelmole] ${output.trim()}`);

    const match = output.match(/https:\/\/[a-zA-Z0-9.-]+\.tunnelmole\.net/);
    if (match && !urlCaptured) {
      urlCaptured = true;
      const tunnelUrl = match[0];
      console.log(`\n🎉 Secured Tunnel URL Captured: ${tunnelUrl}\n`);

      // 3. Stop the dummy server to free up the port
      dummyServer.close(() => {
        console.log("[system] Dummy server shut down. Starting Shopify CLI dev server...");

        // 4. Start Shopify CLI dev using the captured Tunnelmole URL
        shopifyProcess = spawn("npx", ["shopify", "app", "dev", "--localhost-port", port.toString(), "--tunnel-url", `${tunnelUrl}:443`], {
          shell: true,
          stdio: "inherit"
        });

        shopifyProcess.on("close", (code) => {
          console.log(`[system] Shopify CLI process exited with code ${code}`);
          tmoleProcess.kill();
          process.exit(code);
        });
      });
    }
  });

  tmoleProcess.stderr.on("data", (data) => {
    const output = data.toString();
    // Ignore warning about port not running since we handle it
    if (!output.includes("don't have anything running on port")) {
      console.error(`[tunnelmole-error] ${output.trim()}`);
    }
  });

  const cleanup = () => {
    console.log("[system] Shutting down...");
    tmoleProcess.kill();
    if (shopifyProcess) {
      shopifyProcess.kill();
    }
    dummyServer.close();
    process.exit();
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
});
