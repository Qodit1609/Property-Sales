import React, { useCallback, useState } from "react";
import BuyerLayout from "../../components/buyer/BuyerLayout";
import { ToastStack, type ToastMessage } from "@/components/propertyPost/Toast";
import TestimonialFormCard from "@/components/testimonial/TestimonialFormCard";
import { createTestimonial } from "@/features/testimonials/testimonialApi";
import type { CreateTestimonialRequest } from "@/features/testimonials/testimonialTypes";

const BuyerTestimonialPage: React.FC = () => {
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
        title: "Testimonial submitted",
        detail: "Your testimonial has been sent for admin review.",
      });
    } catch (error) {
      pushToast({
        kind: "error",
        title: "Submit failed",
        detail: error instanceof Error ? error.message : "Unable to submit testimonial",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BuyerLayout>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <TestimonialFormCard
        title="Share Your Testimonial"
        subtitle="Tell us about your BhoomiWala experience."
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </BuyerLayout>
  );
};

export default BuyerTestimonialPage;
