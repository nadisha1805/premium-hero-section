import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./tailwind.css";

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
          content="
            frame-ancestors https://admin.shopify.com https://*.myshopify.com;
            script-src 'self' https://cdn.shopify.com https://accounts.shopify.com 'unsafe-inline' 'unsafe-eval';
            style-src 'self' https: 'unsafe-inline';
            img-src 'self' data: https:;
            font-src 'self' https://cdn.shopify.com data:;
            media-src 'self' https:;
            connect-src 'self' https: wss: https://accounts.shopify.com https://*.shopify.com;
            default-src 'self' data: blob: filesystem: 'unsafe-inline' 'unsafe-eval';
          "
        />

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