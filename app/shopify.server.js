import "@shopify/shopify-app-react-router/adapters/node";

import { BillingInterval } from "@shopify/shopify-api";

import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";

import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";

import prisma from "./db.server";

// Get correct app URL
function getAppUrl() {
  const configuredUrl = process.env.SHOPIFY_APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  return "";
}

// Persistent Prisma session storage
const sessionStorage = new PrismaSessionStorage(prisma);

console.log("✅ Using Prisma session storage");

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,

  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",

  apiVersion: ApiVersion.October25,

  scopes: process.env.SCOPES?.split(","),

  appUrl: getAppUrl(),

  authPathPrefix: "/auth",

  sessionStorage,

  distribution: AppDistribution.AppStore,

  billing: {
    "Pro Plan": {
      lineItems: [
        {
          amount: 49,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
        },
      ],
    },

    "Elite Plan": {
      lineItems: [
        {
          amount: 99,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
        },
      ],
    },
  },

  future: {
    expiringOfflineAccessTokens: true,
  },

  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? {
        customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN],
      }
    : {}),
});

export default shopify;

export const apiVersion = ApiVersion.October25;

export const addDocumentResponseHeaders =
  shopify.addDocumentResponseHeaders;

export const authenticate = shopify.authenticate;

export const unauthenticated = shopify.unauthenticated;

export const login = shopify.login;

export const registerWebhooks = shopify.registerWebhooks;

export const appSessionStorage =
  shopify.sessionStorage;