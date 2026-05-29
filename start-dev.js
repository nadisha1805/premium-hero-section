/* global process */
import { spawn } from "child_process";
import http from "http";

const port = 443;
const host = "::1"; // Bind to IPv6 loopback to allow port 443 without admin rights on Windows

console.log("🚀 Initializing Tunnelmole secure tunnel on port 443...");

// 1. Create a dummy HTTP server on the target port and loopback host
const dummyServer = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Dummy Server");
});

dummyServer.listen(port, host, () => {
  console.log(`[system] Temporary dummy server listening on [${host}]:${port} to initialize tunnel...`);

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

        // 4. Start Shopify CLI dev using the captured Tunnelmole URL (ends with :443 as required)
        shopifyProcess = spawn("npx", ["shopify", "app", "dev", "--tunnel-url", `${tunnelUrl}:443`], {
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
