import { useLoaderData, useFetcher, redirect } from "react-router";
import { useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import "../styles/pricing.css";

export const loader = async ({ request }) => {
  return { plan: "PRO" };
};

export const action = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);

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

    const appUrl = process.env.SHOPIFY_APP_URL || process.env.HOST;
    if (!appUrl) {
      console.error("Missing SHOPIFY_APP_URL or HOST environment variable");
      return { error: "Server configuration error: missing app URL" };
    }

    const returnUrl = `${appUrl}/app/pricing?plan=${planName}`;

    // Create recurring app charge using REST API
    const shop = session?.shop;
    if (!shop) {
      console.error("No shop found in session");
      return { error: "Shop not found" };
    }

    const chargeData = {
      recurring_application_charge: {
        name: plan.name,
        price: plan.price,
        return_url: returnUrl,
        test: true,
      },
    };

    console.log("Creating charge for shop:", shop);
    console.log("Charge data:", JSON.stringify(chargeData, null, 2));

    const response = await admin.rest.post({
      path: "/admin/api/2025-01/recurring_application_charges.json",
      data: chargeData,
    });

    const charge = response.body?.recurring_application_charge;

    if (!charge) {
      console.error("No charge returned:", response);
      return { error: "Failed to create charge" };
    }

    if (charge.confirmation_url) {
      console.log("Redirecting to:", charge.confirmation_url);
      return redirect(charge.confirmation_url);
    }

    return { error: "No confirmation URL received" };
  } catch (error) {
    console.error("Subscription error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
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
