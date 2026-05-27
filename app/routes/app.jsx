import { Outlet, useLoaderData, useRouteError, Link } from "react-router";

import { AppProvider } from "@shopify/shopify-app-react-router/react";

export const loader = async () => {
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <div style={{ padding: "20px" }}>
        <nav style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <a href="/app" style={{ color: "white", textDecoration: "none" }}>Home</a>
          <a href="/app/submissions" style={{ color: "white", textDecoration: "none" }}>Customer Data</a>
          <a href="/app/pricing" style={{ color: "white", textDecoration: "none" }}>Subscription Plans</a>
        </nav>
        <Outlet />
      </div>
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.

