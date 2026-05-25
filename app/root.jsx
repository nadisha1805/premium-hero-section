import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <meta
          httpEquiv="Content-Security-Policy"
          content="frame-ancestors https://admin.shopify.com https://*.myshopify.com https://localhost:53135; script-src 'self' https://cdn.shopify.com 'unsafe-inline' 'unsafe-eval'; default-src 'self' data: blob: filesystem: 'unsafe-inline' 'unsafe-eval';"
        />
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            if (!window.WebSocket) return;
            const OriginalWebSocket = window.WebSocket;

            function SafeWebSocket(url, protocols) {
              if (typeof url === 'string' && url.includes('/extensions')) {
                console.debug('[Dev] Blocking /extensions WebSocket handshake.');
                const mock = Object.create(OriginalWebSocket.prototype);
                mock.url = url;
                mock.readyState = 3;
                mock.close = function() {};
                mock.send = function() {};
                mock.addEventListener = function() {};
                mock.removeEventListener = function() {};
                mock.dispatchEvent = function() { return false; };
                return mock;
              }
              return new OriginalWebSocket(url, protocols);
            }

            SafeWebSocket.prototype = OriginalWebSocket.prototype;
            Object.setPrototypeOf(SafeWebSocket, OriginalWebSocket);
            ['CONNECTING','OPEN','CLOSING','CLOSED'].forEach(function(key) {
              if (OriginalWebSocket[key] !== undefined) {
                SafeWebSocket[key] = OriginalWebSocket[key];
              }
            });

            window.WebSocket = SafeWebSocket;

            const originalError = console.error;
            console.error = function(...args) {
              const message = String(args[0] || '');
              if (message.includes('/extensions') || message.includes('WebSocket') || message.includes('Unsafe attempt')) {
                return;
              }
              originalError.apply(console, args);
            };

            window.addEventListener('error', function(event) {
              const msg = String(event.message || '');
              if (msg.includes('/extensions') || msg.includes('WebSocket') || msg.includes('Unsafe attempt')) {
                event.preventDefault();
              }
            }, true);

            window.addEventListener('unhandledrejection', function(event) {
              const reason = String(event.reason || '');
              if (reason.includes('/extensions') || reason.includes('WebSocket') || reason.includes('Unsafe attempt')) {
                event.preventDefault();
              }
            });
          })();
        `}} />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
