export type FeaturedFarmProperty = {
  id: string;
  title: string;
  location: string;
  districtSlug: string;
  image: string;
  priceLabel: string;
  landSizeAcres: number;
  soilQuality: string;
  waterAvailability: string;
  verified: boolean;
};

export type District = {
  id: string;
  name: string;
  listingsText: string;
  image: string;
  slug: string;
};

export type Benefit = {
  id: string;
  title: string;
  description: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  message: string;
};

export type HomeSectionsPayload = {
  featuredProperties: FeaturedFarmProperty[];
  districts: District[];
  benefits: Benefit[];
  testimonials: Testimonial[];
};
