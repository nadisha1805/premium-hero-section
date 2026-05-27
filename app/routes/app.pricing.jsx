import { useLoaderData, useFetcher, redirect } from "react-router";
import { useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import "../styles/pricing.css";

export const loader = async ({ request }) => {
  return { plan: "PRO" };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  if (request.method !== "POST") {
    return { error: "Invalid request method" };
  }

  const formData = await request.formData();
  const planName = formData.get("plan");

  const planConfig = {
    PRO: {
      name: "Pro Creator Plan",
      price: 49.0,
      description: "Unlock all 7 Pro Templates with unlimited submissions and form validation",
    },
    PREMIUM: {
      name: "Elite Premium Plan",
      price: 99.0,
      description: "Unlock ALL 14 Templates with advanced customization and priority support",
    },
  };

  const plan = planConfig[planName];
  if (!plan) {
    return { error: "Invalid plan selected" };
  }

  try {
    // Create recurring app charge using GraphQL
    const CREATE_CHARGE = `
      mutation CreateRecurringApplicationCharge($input: AppRecurringChargeInput!) {
        appRecurringChargeCreate(input: $input) {
          appRecurringCharge {
            id
            confirmationUrl
            returnUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const appUrl = process.env.SHOPIFY_APP_URL || process.env.HOST;
    if (!appUrl) {
      console.error("Missing SHOPIFY_APP_URL or HOST environment variable");
      return { error: "Server configuration error: missing app URL" };
    }

    const returnUrl = `${appUrl}/app/pricing?plan=${planName}`;

    const response = await admin.graphql(CREATE_CHARGE, {
      variables: {
        input: {
          name: plan.name,
          price: {
            amount: plan.price,
            currencyCode: "USD",
          },
          returnUrl: returnUrl,
          test: true,
        },
      },
    });

    const data = await response.json();
    
    if (response.status !== 200) {
      console.error("GraphQL Error Status:", response.status);
      return { error: `API Error: ${response.statusText}` };
    }

    const charge = data.data?.appRecurringChargeCreate?.appRecurringCharge;
    const errors = data.data?.appRecurringChargeCreate?.userErrors;

    if (errors && errors.length > 0) {
      console.error("Shopify API Errors:", errors);
      return { error: errors[0]?.message || "Failed to create charge" };
    }

    if (charge?.confirmationUrl) {
      // Redirect to Shopify's confirmation page
      return redirect(charge.confirmationUrl);
    }

    console.error("No confirmation URL in response:", data);
    return { error: "No confirmation URL received from Shopify" };
  } catch (error) {
    console.error("Subscription error:", error.message, error.stack);
    return { error: `Failed to process subscription: ${error.message}` };
  }
};

export default function PricingPage() {
  const { plan } = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  const isSubmitting = fetcher.state !== "idle";
  const currentPlan = plan;

  useEffect(() => {
    if (fetcher.data?.error) {
      shopify.toast.show(`Error: ${fetcher.data.error}`, { isError: true });
    }
  }, [fetcher.data, shopify]);

  const handleSubscribe = (planName) => {
    if (planName === currentPlan) return;
    fetcher.submit({ plan: planName }, { method: "POST" });
  };

  // eslint-disable-next-line react/prop-types
  const CheckIcon = ({ color = "#10b981" }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div>
      <div className="pricing-container">
        <div className="pricing-header">
          <h1>Select Your App Plan</h1>
          <p>{"Gain instant access to our curated designer forms. Create beautiful hero grids that elevate your store's conversions."}</p>
        </div>
        <div className="pricing-grid">

          {/* PRO PLAN */}
          <div className={`pricing-card ${currentPlan === "PRO" ? "active-plan" : ""}`}>
            {currentPlan === "PRO" && <div className="active-badge">Current Plan</div>}
            {/*{currentPlan === "FREE" && <div className="popular-badge">Popular Upgrade</div>}*/}
            <div className="pricing-card-header">
              <h2 className="pricing-card-title">Pro Creator</h2>
              <div className="pricing-card-price">$49</div>
              <div className="pricing-card-period">per month</div>
            </div>
            <ul className="pricing-features-list">
              <li className="pricing-feature-item">
                <CheckIcon />
                <span><strong>Unlock all 7 Pro Templates</strong></span>
              </li>
              <li className="pricing-feature-item">
                <CheckIcon />
                <span>Custom Form Field Validation</span>
              </li>
              <li className="pricing-feature-item">
                <CheckIcon />
                <span>Unlimited Submissions Database</span>
              </li>
              <li className="pricing-feature-item" style={{ opacity: 0.5 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span>Unlock Premium Templates (Locked)</span>
              </li>
            </ul>
            <button
              className="pricing-action-btn btn-pro"
              onClick={() => handleSubscribe("PRO")}
              disabled={isSubmitting || currentPlan === "PRO"}
            >
              {currentPlan === "PRO" ? "Active" : "Subscribe to Pro"}
            </button>
          </div>

          {/* PREMIUM PLAN */}
          <div className={`pricing-card premium-plan ${currentPlan === "PREMIUM" ? "active-plan" : ""}`}>
            {currentPlan === "PREMIUM" && <div className="active-badge" style={{ background: "#a855f7" }}>Current Plan</div>}
            <div className="pricing-card-header">
              <h2 className="pricing-card-title" style={{ color: "#a855f7" }}>Elite Premium</h2>
              <div className="pricing-card-price">$99</div>
              <div className="pricing-card-period">per month</div>
            </div>
            <ul className="pricing-features-list">
              <li className="pricing-feature-item">
                <CheckIcon color="#a855f7" />
                <span><strong>Unlock ALL 14 Templates (Pro + Premium)</strong></span>
              </li>
              <li className="pricing-feature-item">
                <CheckIcon color="#a855f7" />
                <span>Full Glassmorphic & Neon Themes</span>
              </li>
              <li className="pricing-feature-item">
                <CheckIcon color="#a855f7" />
                <span>Advanced Consultation Schedulers</span>
              </li>
              <li className="pricing-feature-item">
                <CheckIcon color="#a855f7" />
                <span>Priority Developer Customization</span>
              </li>
            </ul>
            <button
              className="pricing-action-btn btn-premium"
              onClick={() => handleSubscribe("PREMIUM")}
              disabled={isSubmitting || currentPlan === "PREMIUM"}
            >
              {currentPlan === "PREMIUM" ? "Active" : "Go Elite Premium"}
            </button>
          </div>
        </div>
        <div className="pricing-footer">
          <p>
            By proceeding with a subscription, you agree to our{" "}
            <a
              href="https://www.shopify.com/in/legal/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="terms-link"
            >
              Terms of Service
            </a>
            . Subject to government tax and other prevailing charges.
          </p>
        </div>
      </div>
    </div>
  );
}
