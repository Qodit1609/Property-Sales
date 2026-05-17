import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import BuyerLayout from "../../components/buyer/BuyerLayout";
import { ToastStack, type ToastMessage } from "@/components/propertyPost/Toast";
import TestimonialFormCard from "@/components/testimonial/TestimonialFormCard";
import { createTestimonial } from "@/features/testimonials/testimonialApi";
import type { CreateTestimonialRequest } from "@/features/testimonials/testimonialTypes";

const BuyerTestimonialPage: React.FC = () => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    setToasts((prev) => [...prev, { id, ...toast }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const handleSubmit = async (payload: CreateTestimonialRequest) => {
    setSubmitting(true);
    try {
      await createTestimonial(payload);
      pushToast({
        kind: "success",
        title: t("buyerPanel.testimonial.toast.submitted"),
        detail: t("buyerPanel.testimonial.toast.submittedDetail"),
      });
    } catch (error) {
      pushToast({
        kind: "error",
        title: t("buyerPanel.testimonial.toast.failed"),
        detail: error instanceof Error ? error.message : t("buyerPanel.testimonial.toast.failedDetail"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BuyerLayout>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <TestimonialFormCard
        title={t("buyerPanel.testimonial.title")}
        subtitle={t("buyerPanel.testimonial.subtitle")}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </BuyerLayout>
  );
};

export default BuyerTestimonialPage;
