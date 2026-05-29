import { Link } from "react-router";
import { Shield, Lock, Eye, RefreshCw, Mail, ArrowLeft } from "lucide-react";

export const meta = () => {
  return [
    { title: "Privacy Policy | Premium Hero Section" },
    { name: "description", content: "Privacy Policy and compliance details for Premium Hero Section Shopify application." }
  ];
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-hero-glow pointer-events-none opacity-60"></div>

      {/* Header / Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition duration-300">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <Shield className="w-5 h-5 text-primary-light" />
          <span>PremiumHero</span>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 flex-grow max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Last Updated: May 29, 2026
          </p>
        </div>

        {/* Introduction Panel */}
        <div className="glass-card rounded-2xl p-8 mb-10 border border-white/10 relative overflow-hidden group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-5 pointer-events-none"></div>
          <p className="text-gray-300 leading-relaxed text-base mb-4">
            At <strong>Premium Hero Section</strong>, we are committed to protecting the privacy of your shop and your customers. This Privacy Policy describes how we collect, use, and share personal information when you install or use our Shopify Application.
          </p>
          <p className="text-gray-300 leading-relaxed text-base">
            By using the Application, you agree to the collection and use of information in accordance with this policy.
          </p>
        </div>

        {/* Section Grid */}
        <div className="flex flex-col gap-10">
          {/* Section 1 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3 text-white">1. Information We Collect</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                When you install the Application, we automatically obtain access to certain information from your Shopify account. This includes:
              </p>
              <ul className="list-disc pl-5 text-gray-400 space-y-2 leading-relaxed">
                <li>
                  <strong className="text-gray-300">Shopify Store Details:</strong> Store name, store domain, email address, owner name, currency settings, and physical address.
                </li>
                <li>
                  <strong className="text-gray-300">Access Tokens:</strong> Secure OAuth credentials supplied by Shopify to read/write specific storefront assets and layout configuration.
                </li>
                <li>
                  <strong className="text-gray-300">Storefront Submissions:</strong> Any information submitted by visitors via custom pre-built hero forms (if active), including customer name, email address, and form configurations.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3 text-white">2. How We Use Your Information</h2>
              <p className="text-gray-400 leading-relaxed mb-3">
                We use the information we collect to provide and improve the App services, specifically:
              </p>
              <ul className="list-disc pl-5 text-gray-400 space-y-2 leading-relaxed">
                <li>To generate and deliver customized designer hero sections inside your Shopify storefront theme.</li>
                <li>To synchronize and track your active subscription plans and usage tiers.</li>
                <li>To process and store lead signups safely so they are available in your Customer Data dashboard.</li>
                <li>To provide customer support and troubleshoot configuration errors.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3 text-white">3. Data Retention and Security</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We value your trust in providing us your information. We maintain administrative, technical, and physical safeguards to protect against unauthorized access, use, or disclosure.
              </p>
              <p className="text-gray-400 leading-relaxed">
                All data is encrypted in transit and stored in highly secure database environments. If you uninstall the Application, your personal data will be flagged for automatic erasure in accordance with Shopify&apos;s data protection requirements.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3 text-white">4. GDPR and CCPA Compliance</h2>
              <p className="text-gray-400 leading-relaxed">
                If you are a resident of the European Economic Area (EEA) or California, you have the right to access personal information we hold about you, and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3 text-white">5. Contact Us</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                For more information about our privacy practices, or if you have questions or complaints, please reach out to our privacy compliance desk:
              </p>
              <div className="glass-card rounded-xl p-5 border border-white/5 max-w-md">
                <p className="text-gray-300 font-semibold mb-1">Premium Hero Section Team</p>
                <p className="text-gray-400 text-sm mb-2">Email: privacy@unitradein.com</p>
                <p className="text-gray-400 text-sm">Physical Address: 123 Designer Row, Suite 404, Tech Hub</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-gray-500 text-sm bg-black">
        <p>&copy; {new Date().getFullYear()} PremiumHero. All rights reserved.</p>
      </footer>
    </div>
  );
}
