// ../Crads/PropertyCard.ts

// 1️⃣ Interface
export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  address: string;
  images: string[];
  sellerId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

// 2️⃣ Property Data
export const properties: Property[] = [
  {
    _id: "6971c2b10faa50fe491b5dda",
    title: "Luxury Villa in Gurgaon",
    description:
      "Premium 5 BHK villa with private pool, landscaped garden, and modern architecture.",
    price: 35000000,
    propertyType: "Villa",
    address: "Indore - South Tukoganj, Madhya Pradesh",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    ],
    sellerId: null,
    status: "approved",
    createdAt: "2026-01-22T06:24:49.160Z",
    updatedAt: "2026-01-22T08:35:07.149Z",
    location: {
      type: "Point",
      coordinates: [75.83, 22.74],
    },
  },
  {
    _id: "6971c2b10faa50fe491b5ddb",
    title: "Commercial Space in Saket",
    description:
      "Prime commercial space, 2000 sq ft, ideal for office or retail. High footfall area.",
    price: 15000000,
    propertyType: "Commercial",
    address: "Indore - Geeta Bhawan, Madhya Pradesh",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c",
    ],
    sellerId: null,
    status: "approved",
    createdAt: "2026-01-22T06:24:49.160Z",
    updatedAt: "2026-01-22T08:35:07.153Z",
    location: {
      type: "Point",
      coordinates: [75.82, 22.75],
    },
  },
  {
    _id: "6971c2b10faa50fe491b5ddc",
    title: "Cozy 1 BHK Flat in Rohini",
    description:
      "Compact 1 BHK flat, perfect for singles or couples. Well-connected area with all amenities.",
    price: 2800000,
    propertyType: "Flat",
    address: "Indore - Sudama Nagar, Madhya Pradesh",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
    ],
    sellerId: null,
    status: "approved",
    createdAt: "2026-01-22T06:24:49.160Z",
    updatedAt: "2026-01-22T08:35:07.155Z",
    location: {
      type: "Point",
      coordinates: [75.81, 22.76],
    },
  },
  {
    _id: "6971c2b10faa50fe491b5ddc",
    title: "Cozy 1 BHK Flat in Rohini",
    description:
      "Compact 1 BHK flat, perfect for singles or couples. Well-connected area with all amenities.",
    price: 2800000,
    propertyType: "Flat",
    address: "Indore - Sudama Nagar, Madhya Pradesh",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
    ],
    sellerId: null,
    status: "approved",
    createdAt: "2026-01-22T06:24:49.160Z",
    updatedAt: "2026-01-22T08:35:07.155Z",
    location: {
      type: "Point",
      coordinates: [75.81, 22.76],
    },
  },
  {
    _id: "6971c2b10faa50fe491b5ddc",
    title: "Cozy 1 BHK Flat in Rohini",
    description:
      "Compact 1 BHK flat, perfect for singles or couples. Well-connected area with all amenities.",
    price: 2800000,
    propertyType: "Flat",
    address: "Indore - Sudama Nagar, Madhya Pradesh",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
    ],
    sellerId: null,
    status: "approved",
    createdAt: "2026-01-22T06:24:49.160Z",
    updatedAt: "2026-01-22T08:35:07.155Z",
    location: {
      type: "Point",
      coordinates: [75.81, 22.76],
    },
  },
  {
    _id: "6971c2b10faa50fe491b5ddc",
    title: "Cozy 1 BHK Flat in Rohini",
    description:
      "Compact 1 BHK flat, perfect for singles or couples. Well-connected area with all amenities.",
    price: 2800000,
    propertyType: "Flat",
    address: "Indore - Sudama Nagar, Madhya Pradesh",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
    ],
    sellerId: null,
    status: "approved",
    createdAt: "2026-01-22T06:24:49.160Z",
    updatedAt: "2026-01-22T08:35:07.155Z",
    location: {
      type: "Point",
      coordinates: [75.81, 22.76],
    },
  },
];
