import type { HomeSectionsPayload } from "../models/homeTypes";

export const defaultHomeSectionsData: HomeSectionsPayload = {
  featuredProperties: [
    {
      id: "farm-1",
      title: "Premium Black Soil Farmland",
      location: "Sanwer Road, Indore",
      districtSlug: "indore",
      image:
        "https://twobighastorage.blob.core.windows.net/2bigha/properties/50ede08b-7e34-4c47-b529-4b65448c5761-1765864511127-306c8d02-medium.webp",
      priceLabel: "INR 29.5L",
      landSizeAcres: 5.2,
      soilQuality: "Black Cotton Soil",
      waterAvailability: "Canal + Borewell",
      verified: true,
    },
    {
      id: "farm-2",
      title: "High-Yield Irrigated Farmland",
      location: "Tarana, Ujjain",
      districtSlug: "ujjain",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1770&auto=format&fit=crop",
      priceLabel: "INR 41L",
      landSizeAcres: 7.8,
      soilQuality: "Alluvial Soil",
      waterAvailability: "Tube-well",
      verified: true,
    },
    {
      id: "farm-3",
      title: "Road-Connected Organic Farmland",
      location: "Bagli, Dewas",
      districtSlug: "dewas",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8XASbZ6aCifGsKGNDR248KJ3gFLi9BGSrXQ&s",
      priceLabel: "INR 23L",
      landSizeAcres: 4.1,
      soilQuality: "Loamy Soil",
      waterAvailability: "Seasonal Pond",
      verified: true,
    },
    {
      id: "farm-4",
      title: "Large Acreage Investment Plot",
      location: "Dharampuri, Dhar",
      districtSlug: "dhar",
      image:
        "https://www.shutterstock.com/image-photo/freshly-sowed-cultivated-agricultural-land-260nw-2020343342.jpg",
      priceLabel: "INR 56L",
      landSizeAcres: 11.4,
      soilQuality: "Mixed Red Soil",
      waterAvailability: "Open Well",
      verified: true,
    },
  ],
  districts: [
    {
      id: "district-1",
      name: "Indore",
      listingsText: "420+ farming lands",
      image:
        "https://videocdn.cdnpk.net/videos/971844f2-eb03-55ef-b155-f42c06182492/horizontal/thumbnails/large.jpg?semt=ais_hybrid&item_id=6229208&w=740&q=80",
      slug: "indore",
    },
    {
      id: "district-2",
      name: "Ujjain",
      listingsText: "280+ farming lands",
      image:
        "https://www.shutterstock.com/image-photo/aerial-view-green-agricultural-fields-260nw-2273046961.jpg",
      slug: "ujjain",
    },
    {
      id: "district-3",
      name: "Dewas",
      listingsText: "190+ farming lands",
      image:
        "https://i.ytimg.com/vi/8FnvVJYZGGY/maxresdefault.jpg",
      slug: "dewas",
    },
    {
      id: "district-4",
      name: "Khargone",
      listingsText: "240+ farming lands",
      image:
        "https://imagecdn.99acres.com/media1/34631/8/692628643M-1767117543014.jpg",
      slug: "khargone",
    },
  ],
  benefits: [
    {
      id: "benefit-1",
      title: "Verified land documentation",
      description:
        "Every listing is validated for ownership clarity and documentation reliability.",
    },
    {
      id: "benefit-2",
      title: "Farming-first filters",
      description:
        "Search by soil quality, irrigation source, acreage, and district instantly.",
    },
    {
      id: "benefit-3",
      title: "Local support network",
      description:
        "Get guidance for site visits, negotiation, and closure from local experts.",
    },
    {
      id: "benefit-4",
      title: "Fast listing visibility",
      description:
        "Sellers get strong listing visibility with rich farmland-specific details.",
    },
  ],
  testimonials: [
    {
      id: "testimonial-1",
      name: "Raghav Patel",
      role: "Farmland Investor, Indore",
      message:
        "I shortlisted and closed a 6-acre parcel in under two weeks. Verified details made the process clear and fast.",
    },
    {
      id: "testimonial-2",
      name: "Meera Solanki",
      role: "Organic Farmer, Ujjain",
      message:
        "Soil and water badges were exactly what I needed. Site visit coordination was seamless from start to finish.",
    },
    {
      id: "testimonial-3",
      name: "Vikas Sharma",
      role: "Land Seller, Dewas",
      message:
        "After posting complete land details, I got genuine buyer responses quickly and closed at a better price.",
    },
  ],
};
