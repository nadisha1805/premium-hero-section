import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { addDocumentResponseHeaders } from "./shopify.server";

export const streamTimeout = 5000;

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  reactRouterContext,
) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    responseHeaders.set("Access-Control-Allow-Origin", "https://admin.shopify.com");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH");
    responseHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, X-CSRF-Token");
    responseHeaders.set("Access-Control-Allow-Credentials", "true");
    responseHeaders.set("Access-Control-Max-Age", "86400");
    responseHeaders.set("Access-Control-Allow-Private-Network", "true");
    return new Response(null, {
      headers: responseHeaders,
      status: 204,
    });
  }

  addDocumentResponseHeaders(request, responseHeaders);
  
  const isLocalhost = request.url.includes('localhost') || request.url.includes('127.0.0.1');
  
  // Always allow CORS and private network access for development
  responseHeaders.set("Access-Control-Allow-Origin", "https://admin.shopify.com");
  responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH");
  responseHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, X-CSRF-Token");
  responseHeaders.set("Access-Control-Allow-Credentials", "true");
  responseHeaders.set("Access-Control-Max-Age", "86400");
  
  // Private Network Access headers (critical for localhost development)
  responseHeaders.set("Permissions-Policy", "private-network-access=(self)");
  responseHeaders.set("Access-Control-Allow-Private-Network", "true");
  
  if (isLocalhost) {
    // Use a valid frame-ancestor policy instead of invalid X-Frame-Options values
    responseHeaders.set(
      "Content-Security-Policy",
      "frame-ancestors https://admin.shopify.com https://*.myshopify.com https://localhost:53135; script-src 'self' https://cdn.shopify.com https://accounts.shopify.com 'unsafe-inline' 'unsafe-eval'; style-src 'self' https: 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://cdn.shopify.com data:; media-src 'self' https:; connect-src 'self' https: wss: https://accounts.shopify.com https://*.shopify.com; default-src 'self' data: blob: filesystem: 'unsafe-inline' 'unsafe-eval';"
    );
  }
  
  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";

  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        },
      },
    );

    // Automatically timeout the React renderer after 6 seconds, which ensures
    // React has enough time to flush down the rejected boundary contents
    setTimeout(abort, streamTimeout + 1000);
  });
}
