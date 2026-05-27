import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";

// In-memory session storage for development
class InMemorySessionStorage {
  constructor() {
    this.sessions = new Map();
  }

  async storeSession(session) {
    this.sessions.set(session.id, session);
    return true;
  }

  async loadSession(id) {
    return this.sessions.get(id) || null;
  }

  async deleteSession(id) {
    return this.sessions.delete(id);
  }

  async findSessionsByShop(shop) {
    return Array.from(this.sessions.values()).filter((session) => session.shop === shop);
  }
}

function getAppUrl() {
  const hostUrl = process.env.HOST?.trim();
  const isProduction = process.env.NODE_ENV === "production";

  if (hostUrl && !isProduction) {
    return hostUrl.startsWith("http") ? hostUrl.replace(/\/$/, "") : `https://${hostUrl.replace(/\/$/, "")}`;
  }

  const configuredUrl = process.env.SHOPIFY_APP_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  if (hostUrl) {
    return hostUrl.startsWith("http") ? hostUrl.replace(/\/$/, "") : `https://${hostUrl.replace(/\/$/, "")}`;
  }

  return "";
}

// Use in-memory storage (Prisma would fail to connect in dev anyway)
const sessionStorage = new InMemorySessionStorage();
console.log("✅ Using in-memory session storage");

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: getAppUrl(),
  authPathPrefix: "/auth",
  sessionStorage: sessionStorage,
  distribution: AppDistribution.AppStore,
  future: {
    expiringOfflineAccessTokens: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const appSessionStorage = shopify.sessionStorage;
