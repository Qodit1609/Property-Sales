import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { Copy, Mail, MessageCircle, Share2 } from "lucide-react";
import { createPortal } from "react-dom";
import type { Property } from "../../features/properties/propertyType";
import { showBuyerActionFeedback } from "./buyerActionFeedback";

interface Props {
  property: Property;
  className?: string;
}

const SharePropertyButton: React.FC<Props> = ({ property, className = "" }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  const { url, shareBody, mailSubject } = useMemo(() => {
    const u = `${window.location.origin}/properties/${property._id}`;
    const body = [property.shortDescription || property.description || property.title, u]
      .filter(Boolean)
      .join("\n\n");
    return {
      url: u,
      shareBody: body,
      mailSubject: property.title || t("propertyCard.propertyFallbackType"),
    };
  }, [property, t]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 6,
        left: Math.max(8, rect.right - 200),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const copyLink = useCallback(() => {
    void navigator.clipboard.writeText(url).then(() => {
      showBuyerActionFeedback(t("buyerPanel.actions.linkCopied"));
      setOpen(false);
    });
  }, [url, t]);

  const shareWhatsApp = useCallback(() => {
    const href = `https://wa.me/?text=${encodeURIComponent(shareBody)}`;
    window.open(href, "_blank", "noopener,noreferrer");
    setOpen(false);
  }, [shareBody]);

  const shareEmail = useCallback(() => {
    const href = `mailto:?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(shareBody)}`;
    window.location.href = href;
    setOpen(false);
  }, [mailSubject, shareBody]);

  const tryNativeShare = useCallback(() => {
    const payload = {
      title: property.title,
      text: property.shortDescription || property.title,
      url,
    };
    if (navigator.share) {
      navigator
        .share(payload)
        .then(() => setOpen(false))
        .catch(() => {
          void copyLink();
        });
    } else {
      void copyLink();
    }
  }, [property.title, property.shortDescription, url, copyLink]);

  return (
    <div ref={wrapRef} className={`relative inline-flex ${className}`}>
      <motion.button
        ref={triggerRef}
        type="button"
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white shadow-sm backdrop-blur-md ring-1 ring-white/15 transition hover:bg-black/55"
        aria-label={t("buyerPanel.actions.shareProperty")}
        aria-expanded={open}
      >
        <Share2 size={16} className={open ? "text-emerald-300" : "text-white"} />
      </motion.button>

      {open &&
        menuPosition &&
        createPortal(
          <div
            className="fixed z-[9999] min-w-[12.5rem] overflow-hidden rounded-xl border border-[var(--b2-soft)] bg-white py-1.5 text-left shadow-[0_12px_32px_rgba(0,0,0,0.12)] ring-1 ring-black/5"
            style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
            role="menu"
            onClick={(e) => e.stopPropagation()}
          >
            {"share" in navigator && typeof navigator.share === "function" && (
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--b1)] transition hover:bg-[var(--b2-soft)]/60"
                onClick={(e) => {
                  e.stopPropagation();
                  tryNativeShare();
                }}
              >
                <Share2 size={14} className="text-[var(--b1-mid)]" />
                {t("buyerPanel.actions.shareMenu")}
              </button>
            )}
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--b1)] transition hover:bg-[var(--b2-soft)]/60"
              onClick={(e) => {
                e.stopPropagation();
                copyLink();
              }}
            >
              <Copy size={14} className="text-[var(--b1-mid)]" />
              {t("buyerPanel.actions.copyLink")}
            </button>
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--b1)] transition hover:bg-[var(--b2-soft)]/60"
              onClick={(e) => {
                e.stopPropagation();
                shareWhatsApp();
              }}
            >
              <MessageCircle size={14} className="text-[var(--b1-mid)]" />
              {t("buyerPanel.actions.whatsApp")}
            </button>
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--b1)] transition hover:bg-[var(--b2-soft)]/60"
              onClick={(e) => {
                e.stopPropagation();
                shareEmail();
              }}
            >
              <Mail size={14} className="text-[var(--b1-mid)]" />
              {t("buyerPanel.actions.email")}
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SharePropertyButton;
