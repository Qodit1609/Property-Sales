import React, { useState } from "react";
import { Button, Input } from "@/components/common";
import type { CreateTestimonialRequest } from "@/features/testimonials/testimonialTypes";
import StarRating from "@/components/testimonial/StarRating";

type Props = {
  title: string;
  subtitle: string;
  submitting?: boolean;
  onSubmit: (payload: CreateTestimonialRequest) => Promise<void> | void;
};

const initialState: CreateTestimonialRequest = {
  fullName: "",
  location: "",
  occupation: "",
  rating: 5,
  description: "",
};

const TestimonialFormCard: React.FC<Props> = ({
  title,
  subtitle,
  submitting = false,
  onSubmit,
}) => {
  const [form, setForm] = useState<CreateTestimonialRequest>(initialState);

  return (
    <section className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[var(--b1)]">{title}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
      </div>
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          await onSubmit(form);
          setForm(initialState);
        }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Full Name"
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            required
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            required
          />
          <Input
            label="Occupation"
            value={form.occupation}
            onChange={(e) => setForm((prev) => ({ ...prev, occupation: e.target.value }))}
            required
          />
          <div>
            <label className="mb-1 block text-sm text-[var(--b1)]">Rating (1-5)</label>
            <div className="rounded-lg border border-border px-3 py-2">
              <StarRating
                value={form.rating}
                onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
                sizeClassName="h-5 w-5"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-[var(--b1)]">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            rows={5}
            required
            className="w-full rounded-lg border border-border px-4 py-2 text-sm text-[var(--b1)] outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button type="submit" loading={submitting} disabled={submitting}>
          Submit Testimonial
        </Button>
      </form>
    </section>
  );
};

export default TestimonialFormCard;
