/*
 * app/components/Footer.tsx
 * Date: August 2026
 * Description: Static footer for the IMR portal.
 *   Inputs:  None — entirely static content.
 *   Processing: Renders company information, contact details,
 *     navigation links, and copyright notice.
 *   Outputs: Footer element with IMR branding and contact info.
 */

export default function Footer() {
  return (
    <footer style={{
      background:   "var(--bg-card)",
      borderTop:    "1px solid var(--border)",
      color:        "var(--text-muted)",
    }}
      className="mt-auto px-6 py-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <div style={{ color: "var(--gold)" }} className="font-bold text-base mb-2">
            Internet Movies Rental
          </div>
          <p className="text-sm leading-relaxed">
            Your trusted source for classic and contemporary cinema.
            Curating the finest films since 1995.
          </p>
        </div>

        {/* Contact */}
        <div>
          <div style={{ color: "var(--text)" }} className="font-semibold text-sm mb-3">
            Contact Us
          </div>
          <ul className="space-y-1.5 text-sm">
            <li>📍 1234 Cinema Blvd, Hollywood, CA 90028</li>
            <li>📞 +1 (555) 867-5309</li>
            <li>✉️ support@imr-rental.com</li>
            <li>🕐 Mon–Fri 9 am – 6 pm PST</li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <div style={{ color: "var(--text)" }} className="font-semibold text-sm mb-3">
            Quick Links
          </div>
          <ul className="space-y-1.5 text-sm">
            <li><a href="/" style={{ color: "var(--text-muted)" }} className="hover:text-white transition-colors">Movie Catalogue</a></li>
            <li><a href="/login" style={{ color: "var(--text-muted)" }} className="hover:text-white transition-colors">Staff Login</a></li>
            <li><a href="/register" style={{ color: "var(--text-muted)" }} className="hover:text-white transition-colors">Create Account</a></li>
          </ul>
        </div>

      </div>

      <div style={{ borderTop: "1px solid var(--border)" }}
        className="max-w-7xl mx-auto mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs"
      >
        <span>© 2026 Internet Movies Rental Company. All rights reserved.</span>
        <span>CPRG 306 · Web Development 2 · SAIT</span>
      </div>
    </footer>
  );
}
