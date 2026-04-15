export type TestimonialStatus = "pending" | "approved" | "rejected";
export type TestimonialRole = "buyer" | "seller";

export type Testimonial = {
  id: string;
  fullName: string;
  location: string;
  occupation: string;
  rating: number;
  description: string;
  userId: string | null;
  role: TestimonialRole;
  status: TestimonialStatus;
  createdAt: string;
};

export type CreateTestimonialRequest = {
  fullName: string;
  location: string;
  occupation: string;
  rating: number;
  description: string;
};
