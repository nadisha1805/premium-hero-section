import { useLoaderData, useFetcher } from "react-router";
import { useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import "../styles/pricing.css";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  let subscription = await prisma.shopSubscription.findUnique({
    where: { shop }
  });

  if (!subscription) {
    subscription = await prisma.shopSubscription.create({
      data: { shop, plan: "FREE" }
    });
  }

  return { plan: subscription.plan, shop };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const plan = formData.get("plan");

  if (["FREE", "PRO", "PREMIUM"].includes(plan)) {
    const updated = await prisma.shopSubscription.upsert({
      where: { shop },
      update: { plan },
      create: { shop, plan }
    });
    return { success: true, plan: updated.plan };
  }

  return { success: false, error: "Invalid plan type specified" };
};

export default function PricingPage() {
  const { plan } = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  const isSubmitting = fetcher.state !== "idle";
  const currentPlan = fetcher.data?.success ? fetcher.data.plan : plan;

  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show(`Plan updated to ${fetcher.data.plan}!`);
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
      </div>
    </div>
  );
}
