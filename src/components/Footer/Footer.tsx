import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Send,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  ShieldCheck,
  Landmark,
  Leaf,
  TreePine,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const QUICK_LINKS: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Buy Land", href: "/farmhouse" },
  { label: "Agriculture Land", href: "/agriculture-land" },
  { label: "Resort Properties", href: "/resort-properties" },
  { label: "Rent Farmhouse", href: "/rent-farmhouse" },
  { label: "About", href: "/" },
  { label: "Blogs", href: "/" },
];

const PROPERTY_CATEGORIES: FooterLink[] = [
  { label: "Farm Land", href: "/farmhouse" },
  { label: "Farmhouse", href: "/farmhouse" },
  { label: "Agricultural Land", href: "/agriculture-land" },
  { label: "Investment Land", href: "/resort-properties" },
  { label: "Rent Properties", href: "/rent-farmhouse" },
];

const USEFUL_LINKS: FooterLink[] = [
  { label: "Privacy Policy", href: "/" },
  { label: "Terms & Conditions", href: "/" },
  { label: "Sitemap", href: "/" },
  { label: "FAQs", href: "/" },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <Instagram className="w-4 h-4" />,
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: <Facebook className="w-4 h-4" />,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/919039055488",
    icon: <MessageCircle className="w-4 h-4" />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: <Youtube className="w-4 h-4" />,
  },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck className="w-5 h-5" />, text: "Verified Properties" },
  { icon: <Landmark className="w-5 h-5" />, text: "Govt. Approved Lands" },
  { icon: <Leaf className="w-5 h-5" />, text: "Eco-Friendly Farms" },
  { icon: <TreePine className="w-5 h-5" />, text: "Premium Listings" },
];

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                      */
/* ------------------------------------------------------------------ */

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => (
  <div>
    <h3 className="text-sm font-semibold uppercase tracking-widest mb-5 text-[var(--b2)]">
      {title}
    </h3>
    <nav aria-label={title}>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-fg/70 hover:text-[var(--b2)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--b1)] rounded-sm"
              >
                {link.label}
              </a>
            ) : (
              <Link
                to={link.href}
                className="text-sm text-fg/70 hover:text-[var(--b2)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--b1)] rounded-sm"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  </div>
);

const SocialIcon: React.FC<SocialLink> = ({ label, href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-fg/80 hover:bg-[var(--b2)] hover:text-[var(--b1)] transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--b1)]"
  >
    {icon}
  </a>
);

const BackToTop: React.FC = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="group flex items-center gap-2 mx-auto sm:mx-0 text-xs font-medium text-fg/60 hover:text-[var(--b2)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2)] rounded-sm"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full border border-fg/20 group-hover:border-[var(--b2)] group-hover:bg-[var(--b2)]/10 transition-all duration-300">
        <ArrowUp className="w-3.5 h-3.5" />
      </span>
      Back to Top
    </button>
  );
};

/* ------------------------------------------------------------------ */
/*  Newsletter                                                         */
/* ------------------------------------------------------------------ */

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    },
    [email]
  );

  return (
    <div className="text-center sm:text-left">
      <h3 className="text-sm font-semibold uppercase tracking-widest mb-3 text-[var(--b2)]">
        Stay Updated
      </h3>
      <p className="text-sm text-fg/60 mb-4 max-w-sm mx-auto sm:mx-0">
        Get the latest property listings and investment tips delivered to your
        inbox.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto sm:mx-0 w-full"
        aria-label="Newsletter subscription"
      >
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full sm:flex-1 min-w-0 px-4 py-2.5 text-sm rounded-lg bg-white/10 border border-fg/20 text-fg placeholder:text-fg/40 focus:outline-none focus:border-[var(--b2)] focus:ring-1 focus:ring-[var(--b2)] transition-colors duration-200"
        />
        <button
          type="submit"
          aria-label="Subscribe to newsletter"
          className="flex items-center justify-center w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[var(--b2)] text-[var(--b1)] font-semibold text-sm hover:bg-[var(--b2-soft)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--b1)] shrink-0"
        >
          <Send className="w-4 h-4 mr-2" />
          <span>Subscribe</span>
        </button>
      </form>
      {submitted && (
        <p className="mt-2 text-xs text-[var(--b2)] animate-pulse">
          Thank you for subscribing!
        </p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Footer                                                        */
/* ------------------------------------------------------------------ */

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="footer-bg"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--b2) 72%, var(--b1) 28%) 0%, var(--b1) 60%)",
      }}
      role="contentinfo"
    >
      {/* Trust Badges Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2.5 justify-center text-fg/80"
              >
                <span className="text-[var(--b2)]">{badge.icon}</span>
                <span className="text-xs sm:text-sm font-medium">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-14 pb-8 sm:pb-10">
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-12 text-center sm:text-left">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5 sm:space-y-6 flex flex-col items-center sm:items-start">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-block text-2xl font-bold text-fg font-serif focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2)] rounded-sm"
            >
              Bhoomi<span className="text-[var(--b2)]"> Wala</span>
            </Link>

            <p className="text-sm leading-relaxed text-fg/70 max-w-xs">
              Your trusted partner in finding the perfect land investment.
              Explore verified farm lands, farmhouses, and agricultural
              properties across India.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <SocialIcon key={social.label} {...social} />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <FooterColumn title="Quick Links" links={QUICK_LINKS} />
          </div>

          {/* Property Categories */}
          <div className="lg:col-span-2">
            <FooterColumn title="Categories" links={PROPERTY_CATEGORIES} />
          </div>

          {/* Useful Links + Contact */}
          <div className="lg:col-span-4 space-y-8">
            <FooterColumn title="Useful Links" links={USEFUL_LINKS} />

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 text-[var(--b2)]">
                Contact Us
              </h3>
              <address className="not-italic space-y-3">
                <a
                  href="mailto:info@1bigha.com"
                  className="flex items-center gap-2.5 text-sm text-fg/70 hover:text-[var(--b2)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2)] rounded-sm justify-center sm:justify-start"
                >
                  <Mail className="w-4 h-4 shrink-0 text-[var(--b2)]" />
                  info@bhoomiwala.com
                </a>
                <a
                  href="tel:+919039055488"
                  className="flex items-center gap-2.5 text-sm text-fg/70 hover:text-[var(--b2)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2)] rounded-sm justify-center sm:justify-start"
                >
                  <Phone className="w-4 h-4 shrink-0 text-[var(--b2)]" />
                  +0731 426 8367
                </a>
                <p className="flex items-start gap-2.5 text-sm text-fg/70 justify-center sm:justify-start">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[var(--b2)]" />
                  <span>51, Electronic Complex,Indore, M.P 452007</span>
                </p>
              </address>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <Newsletter />
            <BackToTop />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/15 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-fg/50">
          <p>
            &copy; {currentYear} BhoomiWala.com &middot; All Rights Reserved
          </p>
          <p>
            Developed with care by{" "}
            <span className="text-[var(--b2)] font-semibold">TRH</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
