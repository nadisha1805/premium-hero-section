import { useLoaderData, Link, useLocation } from "react-router";
import { TEMPLATES } from "../data/templates";
import "../styles/premium-templates.css";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ params, request }) => {
  const { session, billing } = await authenticate.admin(request);
  const shop = session.shop;

  // Query Shopify Billing API to check active subscriptions
  const billingCheck = await billing.check({
    plans: ["Pro Plan", "Elite Plan"],
    isTest: true,
  });

  let activePlan = "FREE";
  if (billingCheck.hasActivePayment && billingCheck.appSubscriptions.length > 0) {
    const activeSub = billingCheck.appSubscriptions.find(sub => sub.status === "ACTIVE");
    if (activeSub) {
      if (activeSub.name === "Pro Plan") {
        activePlan = "PRO";
      } else if (activeSub.name === "Elite Plan") {
        activePlan = "PREMIUM";
      }
    }
  }

  // Sync database subscription status
  const dbSubscription = await prisma.shopSubscription.upsert({
    where: { shop },
    update: { plan: activePlan },
    create: { shop, plan: activePlan },
  });

  const { templateId } = params;

  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    throw new Response("Template Not Found", { status: 404 });
  }
  return { 
    plan: dbSubscription.plan, 
    template, 
    shop 
  };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();
  const templateId = formData.get("templateId");

  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    return { error: "Template not found" };
  }

  // Extract name, email and other fields
  const submissionData = {};
  let name = "Anonymous User";
  let email = "no-email@example.com";

  for (const [key, value] of formData.entries()) {
    if (key === "templateId") continue;
    
    if (key.toLowerCase().includes("name")) {
      name = value.toString();
    } else if (key.toLowerCase().includes("email")) {
      email = value.toString();
    } else {
      submissionData[key] = value.toString();
    }
  }

  await prisma.formSubmission.create({
    data: {
      shop,
      templateId,
      brand: template.brand,
      name,
      email,
      formData: JSON.stringify(submissionData),
    },
  });

  return { success: true };
};

export default function TemplateDetailPage() {
  const { plan, template } = useLoaderData();
  const location = useLocation();

  // Check if this template is unlocked under current plan
  const unlocked = plan === "PREMIUM" || (plan === "PRO" && template.tier === "pro");

  const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 11V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V11M5 11H19C20.1046 11 21 11.8954 21 13V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V13C3 11.8954 3.89543 11 5 11Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div>
      {/* Simulation Banner Header */}
      <div style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link to={`/app${location.search}`} style={{
            color: "#64748b",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem"
          }}>
            &larr; Back to gallery
          </Link>
          <div style={{ borderLeft: "1px solid #e2e8f0", height: "24px" }} />
          <div>
            <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>
              {template.name} ({template.brand.toUpperCase()})
            </h4>
            <span style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              Visual Template Preview &bull; Tier:
              <strong className={template.tier === "premium" ? "animated-premium-badge" : ""} style={{ color: template.tier === "premium" ? "#a855f7" : "#d97706" }}>
                {template.tier.toUpperCase()}
              </strong>
            </span>
          </div>
        </div>

        <div>
          {unlocked ? (
            <div style={{
              background: "#e8f5e9",
              color: "#2e7d32",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              &check; Unlocked & Ready to Use
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                background: "#fef3c7",
                color: "#d97706",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <LockIcon /> Locked for storefront installation
              </div>
              <Link to={`/app/pricing${location.search}`}>
                <button style={{
                  background: "#a855f7",
                  color: "white",
                  border: "none",
                  padding: "0.55rem 1.2rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}>
                  Upgrade to Unlock
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Actual Hero Form Section Visual Sandbox */}
      <div className={`hero-template-wrapper tpl-${template.id}`}>

        {/* Media Background */}
        {template.tier === "premium" && template.video ? (
          <video
            className="hero-media-bg"
            src={template.video}
            poster={template.image}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : template.image ? (
          <img
            className={`hero-media-bg ${template.tier === "pro" ? "pro-zoom" : ""}`}
            src={template.image}
            alt={`${template.name} preview`}
          />
        ) : null}

        {/* Cinematic Overlays */}
        <div className={`hero-media-overlay overlay-${template.tier}`}></div>

        <div className="hero-layout-content hero-layout-centered">
          {/* Hero Centered Content Text Block */}
          <div style={{ maxWidth: "800px", position: "relative", zIndex: 10 }}>
            <h1 className="hero-tagline">{template.tagline}</h1>
            <p className="hero-description">{template.description}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "2rem", alignItems: "center" }}>
              {template.features.map((feat, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1rem", opacity: 0.9 }}>
                  <span style={{ color: template.accentColor, fontSize: "1.5rem" }}>&bull;</span> {feat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
