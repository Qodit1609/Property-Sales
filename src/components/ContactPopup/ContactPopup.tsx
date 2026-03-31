import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

interface ContactPopupProps {
  onClose?: () => void;
}

interface FieldProps {
  id: keyof ContactFormData;
  label: string;
  value: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  error?: string;
  required?: boolean;
  icon: React.ReactNode;
  onChange: (field: keyof ContactFormData, value: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NameIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5 text-[var(--brown)] transition-colors group-focus-within:text-[var(--b1-mid)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19a6 6 0 0 0-12 0" />
    <circle cx="9" cy="7" r="4" />
  </svg>
);

const EmailIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5 text-[var(--brown)] transition-colors group-focus-within:text-[var(--b1-mid)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 5 8-5" />
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5 text-[var(--brown)] transition-colors group-focus-within:text-[var(--b1-mid)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 4h3l2 5-2.5 1.8a15.1 15.1 0 0 0 5.7 5.7L15 14l5 2v3a2 2 0 0 1-2.2 2c-8-.7-14.1-6.8-14.8-14.8A2 2 0 0 1 5 4Z"
    />
  </svg>
);

const MessageIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5 text-[var(--brown)] transition-colors group-focus-within:text-[var(--b1-mid)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h8M8 14h5m-9 6 1.9-3.8A8 8 0 1 1 20 12a8 8 0 0 1-14.1 4.2L4 20Z"
    />
  </svg>
);

const Field = memo(function Field({
  id,
  label,
  value,
  type = "text",
  autoComplete,
  error,
  required,
  icon,
  onChange,
}: FieldProps) {
  const hasValue = value.trim().length > 0;

  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-11 top-1/2 z-10 -translate-y-1/2 text-sm text-[var(--brown)] transition-all duration-200 ease-out group-focus-within:top-3 group-focus-within:translate-y-0 group-focus-within:text-xs group-focus-within:text-[var(--b1-mid)]"
        style={hasValue ? { top: "0.75rem", transform: "translateY(0)", fontSize: "0.75rem", color: "var(--b1-mid)" } : undefined}
      >
        {label}
        {required ? " *" : ""}
      </label>

      <div
        className={`pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 ${
          error ? "text-[var(--error)]" : ""
        }`}
      >
        {icon}
      </div>

      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(id, e.target.value)}
        className={`h-14 w-full rounded-2xl border bg-[var(--fg)] pl-11 pr-4 pt-5 text-sm text-[var(--b1)] shadow-sm outline-none transition duration-200 placeholder:text-transparent hover:border-[var(--b2)] focus:border-[var(--b1-mid)] focus:ring-2 focus:ring-[var(--b2)] ${
          error ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error-bg)]" : "border-[var(--b2)]"
        }`}
        placeholder={label}
      />

      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-[var(--error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
});

const ContactPopup: React.FC<ContactPopupProps> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const validate = useCallback((data: ContactFormData): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};

    if (!data.name.trim()) nextErrors.name = "Name is required.";
    if (!data.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!data.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!data.message.trim()) nextErrors.message = "Please enter your message.";

    return nextErrors;
  }, []);

  const isFormValid = useMemo(() => {
    const nextErrors = validate(formData);
    return Object.keys(nextErrors).length === 0;
  }, [formData, validate]);

  const handleFieldChange = useCallback(
    (field: keyof ContactFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (submitStatus !== "idle") setSubmitStatus("idle");
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [submitStatus]
  );

  const openWhatsApp = useCallback(() => {
    const phone = "919999999999";
    const message = encodeURIComponent(
      `Hi, I'm interested in your property listing.${formData.name ? ` My name is ${formData.name}.` : ""}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
  }, [formData.name]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const nextErrors = validate(formData);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;

      try {
        setIsSubmitting(true);
        setSubmitStatus("idle");
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } catch {
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validate]
  );

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => setIsMounted(true));

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const firstInput = containerRef.current?.querySelector<HTMLInputElement>("#name");
      firstInput?.focus();
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
        return;
      }

      if (event.key !== "Tab" || !containerRef.current) return;

      const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    return () => document.removeEventListener("keydown", keyDownHandler);
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-popup-title"
      className={`relative w-full overflow-hidden rounded-2xl border border-[var(--b2)]/80 bg-[var(--fg)] shadow-[0_18px_60px_rgba(27,67,50,0.24)] transition-all duration-300 ease-out ${
        isMounted ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.98] opacity-0"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--b2-soft)] via-[var(--fg)] to-[var(--b2)]" />

      <div className="relative z-10 space-y-5 p-4 sm:p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-2 inline-flex items-center rounded-full bg-[var(--b2-soft)] px-3 py-1 text-xs font-semibold tracking-wide text-[var(--b1-mid)]">
              PREMIUM ASSISTANCE
            </p>
            <h2 id="contact-popup-title" className="text-[1.8rem] leading-tight font-semibold tracking-tight text-[var(--b1)] sm:text-[2.1rem]">
              Let us find your perfect property
            </h2>
            <p className="mt-1.5 text-sm text-[var(--brown)] sm:text-base">
              Share your requirements and our expert team will connect with curated options.
            </p>
          </div>

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close contact form"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--b2)] bg-[var(--fg)] text-[var(--brown)] shadow-sm transition hover:scale-105 hover:border-[var(--b1-mid)] hover:text-[var(--b1)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6 18 18M18 6 6 18" />
              </svg>
            </button>
          ) : null}
        </div>

        <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            <div className="md:col-span-1">
              <Field
                id="name"
                label="Full Name"
                value={formData.name}
                autoComplete="name"
                required
                error={errors.name}
                onChange={handleFieldChange}
                icon={<NameIcon />}
              />
            </div>
            <div className="md:col-span-1">
              <Field
                id="email"
                type="email"
                label="Email Address"
                value={formData.email}
                autoComplete="email"
                required
                error={errors.email}
                onChange={handleFieldChange}
                icon={<EmailIcon />}
              />
            </div>
            <div className="md:col-span-1">
              <Field
                id="phone"
                type="tel"
                label="Phone Number"
                value={formData.phone}
                autoComplete="tel"
                required
                error={errors.phone}
                onChange={handleFieldChange}
                icon={<PhoneIcon />}
              />
            </div>

            <div className="group relative md:col-span-2">
              <label
                htmlFor="message"
                className="pointer-events-none absolute left-11 top-3 z-10 text-xs text-[var(--b1-mid)]"
              >
                Message *
              </label>
              <div className="pointer-events-none absolute left-3 top-4 z-10">
                <MessageIcon />
              </div>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                onChange={(e) => handleFieldChange("message", e.target.value)}
                className={`w-full resize-none rounded-2xl border bg-[var(--fg)] pl-11 pr-4 pt-7 text-sm text-[var(--b1)] shadow-sm outline-none transition duration-200 placeholder:text-[var(--brown)] hover:border-[var(--b2)] focus:border-[var(--b1-mid)] focus:ring-2 focus:ring-[var(--b2)] ${
                  errors.message ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error-bg)]" : "border-[var(--b2)]"
                }`}
                placeholder="Tell us your location preference, budget, and purpose..."
              />
              {errors.message ? (
                <p id="message-error" className="mt-1.5 text-xs text-[var(--error)]">
                  {errors.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[var(--b2)]/70 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-2 text-sm text-[var(--brown)]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--b1-mid)]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                </svg>
              </span>
              We will get back to you within 24 hours.
            </p>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={openWhatsApp}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)] px-4 text-sm font-medium text-[var(--b1-mid)] transition hover:border-[var(--b1-mid)] hover:text-[var(--b1)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              >
                Quick WhatsApp
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="inline-flex h-11 min-w-[150px] items-center justify-center rounded-xl bg-gradient-to-r from-[var(--b1-mid)] to-[var(--b1)] px-5 text-sm font-semibold text-[var(--fg)] shadow-[0_10px_24px_rgba(45,106,79,0.35)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Sending...
                  </span>
                ) : (
                  "Send Inquiry"
                )}
              </button>
            </div>
          </div>

          {submitStatus === "success" ? (
            <div className="rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)] px-4 py-3 text-sm text-[var(--b1)]">
              Success! Your inquiry has been submitted. Our team will contact you shortly.
            </div>
          ) : null}

          {submitStatus === "error" ? (
            <div className="rounded-xl border border-[var(--error)] bg-[var(--error-bg)] px-4 py-3 text-sm text-[var(--error)]">
              Something went wrong. Please try again in a moment.
            </div>
          ) : null}
        </form>
      </div>

    </div>
  );
};

export default memo(ContactPopup);