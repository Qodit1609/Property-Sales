export interface AgentDetails {
  name: string
  phone: string
  email: string
  address: string
  image: string
}

export interface OwnerDetails {
  name: string
  phone: string
}

export interface PropertyMedia {
  gallery: string[]
  videoUrl: string
}

export interface PropertyHighlights {
  landType: "Agricultural"
  waterAvailability: boolean
  electricityAvailable: boolean
  roadAccess: boolean
  soilType: string
}

export interface ExtendedProperty {
  landSize: string
  totalImages: number
  media: PropertyMedia
  owner: OwnerDetails
  agent: AgentDetails
  highlights: PropertyHighlights
  aboutProperty: string
}

export interface Property {
  _id: string
  title: string
  description: string
  price: number
  propertyType: string
  address: string
  images: string[]
  sellerId: string | null
  status: string
  createdAt: string
  updatedAt: string
  location: {
    type: "Point"
    coordinates: [number, number]
  }
}

export const properties: (Property & ExtendedProperty)[] = [
  {
    _id: "agri-indore-001",
    title: "Agricultural Land in Sanwer",
    description: "Fertile agricultural land suitable for wheat and soybean farming.",
    price: 15000000,
    propertyType: "Agricultural Land",
    address: "Village Sanwer, Indore, Madhya Pradesh",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
    ],
    sellerId: null,
    status: "approved",
    createdAt: "2026-01-22T06:24:49.160Z",
    updatedAt: "2026-01-22T08:35:07.149Z",
    location: {
      type: "Point",
      coordinates: [75.82, 22.92]
    },
    landSize: "5 Acres",
    totalImages: 2,
    media: {
      gallery: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e"
      ],
      videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
    },
    owner: {
      name: "Ramesh Patel",
      phone: "+91 98765 43210"
    },
    agent: {
      name: "Nikki Houston",
      phone: "+91 79999 12345",
      email: "nikki.indore@realty.com",
      address: "Vijay Nagar, Indore, MP",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    highlights: {
      landType: "Agricultural",
      waterAvailability: true,
      electricityAvailable: true,
      roadAccess: true,
      soilType: "Black Cotton Soil"
    },
    aboutProperty:
      "This agricultural land is located near Sanwer with excellent soil fertility, proper irrigation facilities, and direct road access. Ideal for long-term farming investment."
  },
  {
    _id: "agri-indore-002",
    title: "Farmland in Hatod",
    description: "Open agricultural land with tube well and electricity connection.",
    price: 12000000,
    propertyType: "Agricultural Land",
    address: "Village Hatod, Indore, Madhya Pradesh",
    images: [
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399"
    ],
    sellerId: null,
    status: "approved",
    createdAt: "2026-01-22T06:24:49.160Z",
    updatedAt: "2026-01-22T08:35:07.149Z",
    location: {
      type: "Point",
      coordinates: [75.78, 22.7]
    },
    landSize: "3.5 Acres",
    totalImages: 1,
    media: {
      gallery: [
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
      ],
      videoUrl: ""
    },
    owner: {
      name: "Mahesh Verma",
      phone: "+91 99887 66554"
    },
    agent: {
      name: "Amit Joshi",
      phone: "+91 78888 33445",
      email: "amit.joshi@realty.com",
      address: "Rajendra Nagar, Indore, MP",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    highlights: {
      landType: "Agricultural",
      waterAvailability: true,
      electricityAvailable: true,
      roadAccess: false,
      soilType: "Loamy Soil"
    },
    aboutProperty:
      "Peaceful farmland located in Hatod village, suitable for vegetable farming and organic agriculture."
  },
  {
  _id: "agri-indore-003",
  title: "Agricultural Land in Mhow",
  description:
    "Well-maintained agricultural land suitable for maize and soybean farming with good water availability.",
  price: 18000000,
  propertyType: "Agricultural Land",
  address: "Village Mhow, Indore, Madhya Pradesh",
  images: [
    "https://picsum.photos/id/1018/1200/800",
    "https://picsum.photos/id/1025/1200/800"
  ],
  sellerId: null,
  status: "approved",
  createdAt: "2026-01-22T06:24:49.160Z",
  updatedAt: "2026-01-22T08:35:07.160Z",
  location: {
    type: "Point",
    coordinates: [75.77, 22.55]
  },
  landSize: "6 Acres",
  totalImages: 2,
  media: {
    gallery: [
      "https://picsum.photos/id/1039/1200/800",
      "https://picsum.photos/id/1043/1200/800",
      "https://picsum.photos/id/1050/1200/800"
    ],
    videoUrl:
      "https://sample-videos.com/video123/mp4/720/sample_960x400_ocean_with_audio.mp4"
  },
  owner: {
    name: "Suresh Yadav",
    phone: "+91 98260 44556"
  },
  agent: {
    name: "Rahul Sharma",
    phone: "+91 79998 66778",
    email: "rahul.sharma@realty.com",
    address: "Palasia, Indore, MP",
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  highlights: {
    landType: "Agricultural",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    soilType: "Medium Black Soil"
  },
  aboutProperty:
    "Located near Mhow, this agricultural land offers excellent connectivity, fertile soil, and year-round water availability, making it ideal for commercial farming."
},
{
  _id: "agri-indore-004",
  title: "Agricultural Land in Depalpur",
  description:
    "Spacious agricultural land with canal water access, ideal for multi-crop farming.",
  price: 22000000,
  propertyType: "Agricultural Land",
  address: "Village Depalpur, Indore, Madhya Pradesh",
  images: [
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  ],
  sellerId: null,
  status: "approved",
  createdAt: "2026-01-22T06:24:49.160Z",
  updatedAt: "2026-01-22T08:35:07.170Z",
  location: {
    type: "Point",
    coordinates: [75.53, 22.85]
  },

  landSize: "8 Acres",
  totalImages: 2,
  media: {
    gallery: [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
    ],
    videoUrl: ""
  },
  owner: {
    name: "Narayan Singh",
    phone: "+91 97533 88990"
  },
  agent: {
    name: "Ankit Jain",
    phone: "+91 70001 55443",
    email: "ankit.jain@realty.com",
    address: "Scheme No. 140, Indore, MP",
    image: "https://randomuser.me/api/portraits/men/52.jpg"
  },
  highlights: {
    landType: "Agricultural",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    soilType: "Deep Black Soil"
  },
  aboutProperty:
    "This farmland in Depalpur is well-connected and benefits from canal irrigation, making it highly productive and suitable for long-term agricultural investment."
},
{
  _id: "agri-indore-005",
  title: "Agricultural Land near Kanadia Road",
  description:
    "Prime agricultural land located near Indore city limits, suitable for vegetables and cash crops.",
  price: 26000000,
  propertyType: "Agricultural Land",
  address: "Kanadia Road Village, Indore, Madhya Pradesh",
  images: [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399"
  ],
  sellerId: null,
  status: "approved",
  createdAt: "2026-01-22T06:24:49.160Z",
  updatedAt: "2026-01-22T08:35:07.180Z",
  location: {
    type: "Point",
    coordinates: [75.90, 22.68]
  },

  landSize: "4 Acres",
  totalImages: 2,
  media: {
    gallery: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      "https://images.unsplash.com/photo-1500534314209-a26db0f5a8a6",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
    ],
    videoUrl: "https://sample-videos.com/video123/mp4/720/sample_960x400_ocean_with_audio.mp4"
  },
  owner: {
    name: "Vikram Malviya",
    phone: "+91 98932 77110"
  },
  agent: {
    name: "Pooja Mehta",
    phone: "+91 79990 22334",
    email: "pooja.mehta@realty.com",
    address: "Bhawarkua, Indore, MP",
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  highlights: {
    landType: "Agricultural",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    soilType: "Loamy Black Soil"
  },
  aboutProperty:
    "Located close to Kanadia Road, this land offers easy city access while maintaining high agricultural value. Ideal for vegetable farming and polyhouse development."
},
{
  _id: "agri-indore-006",
  title: "Agricultural Land in Rau",
  description:
    "Well-connected agricultural land near Rau with fertile soil and reliable irrigation facilities.",
  price: 24000000,
  propertyType: "Agricultural Land",
  address: "Village Rau, Indore, Madhya Pradesh",
  images: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
  ],
  sellerId: null,
  status: "approved",
  createdAt: "2026-01-22T06:24:49.160Z",
  updatedAt: "2026-01-22T08:35:07.190Z",
  location: {
    type: "Point",
    coordinates: [75.83, 22.63]
  },

  landSize: "5.5 Acres",
  totalImages: 2,
  media: {
    gallery: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
    ],
    videoUrl: ""
  },
  owner: {
    name: "Kailash Patidar",
    phone: "+91 98267 55421"
  },
  agent: {
    name: "Sonal Rathore",
    phone: "+91 79991 66778",
    email: "sonal.rathore@realty.com",
    address: "Rajendra Nagar, Indore, MP",
    image: "https://randomuser.me/api/portraits/women/48.jpg"
  },
  highlights: {
    landType: "Agricultural",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    soilType: "Black Alluvial Soil"
  },
  aboutProperty:
    "This agricultural land in Rau offers excellent connectivity to Indore city along with fertile soil and strong irrigation support, making it ideal for high-yield farming."
},
{
  _id: "agri-indore-007",
  title: "Agricultural Land in Betma",
  description:
    "Productive agricultural land with open surroundings, suitable for soybean and gram cultivation.",
  price: 19500000,
  propertyType: "Agricultural Land",
  address: "Village Betma, Indore, Madhya Pradesh",
  images: [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
  ],
  sellerId: null,
  status: "approved",
  createdAt: "2026-01-22T06:24:49.160Z",
  updatedAt: "2026-01-22T08:35:07.200Z",
  location: {
    type: "Point",
    coordinates: [75.61, 22.73]
  },

  landSize: "6.5 Acres",
  totalImages: 2,
  media: {
    gallery: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
    ],
    videoUrl: ""
  },
  owner: {
    name: "Govind Patidar",
    phone: "+91 98262 99887"
  },
  agent: {
    name: "Deepak Chauhan",
    phone: "+91 79993 44556",
    email: "deepak.chauhan@realty.com",
    address: "Sudama Nagar, Indore, MP",
    image: "https://randomuser.me/api/portraits/men/61.jpg"
  },
  highlights: {
    landType: "Agricultural",
    waterAvailability: true,
    electricityAvailable: false,
    roadAccess: true,
    soilType: "Medium Black Soil"
  },
  aboutProperty:
    "Located in Betma village, this agricultural land offers fertile soil and peaceful surroundings, making it ideal for traditional and commercial farming."
},
{
  _id: "agri-indore-008",
  title: "Agricultural Land near Pithampur",
  description:
    "Large agricultural land parcel near Pithampur with strong soil quality and irrigation access.",
  price: 30000000,
  propertyType: "Agricultural Land",
  address: "Village near Pithampur, Indore, Madhya Pradesh",
  images: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
  ],
  sellerId: null,
  status: "approved",
  createdAt: "2026-01-22T06:24:49.160Z",
  updatedAt: "2026-01-22T08:35:07.210Z",
  location: {
    type: "Point",
    coordinates: [75.70, 22.62]
  },

  landSize: "10 Acres",
  totalImages: 2,
  media: {
    gallery: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
    ],
    videoUrl: "https://sample-videos.com/video123/mp4/720/sample_960x400_ocean_with_audio.mp4"
  },
  owner: {
    name: "Prakash Solanki",
    phone: "+91 98930 11223"
  },
  agent: {
    name: "Ritu Agarwal",
    phone: "+91 79992 77889",
    email: "ritu.agarwal@realty.com",
    address: "Sapna Sangeeta, Indore, MP",
    image: "https://randomuser.me/api/portraits/women/57.jpg"
  },
  highlights: {
    landType: "Agricultural",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    soilType: "Deep Black Soil"
  },
  aboutProperty:
    "Situated close to Pithampur industrial area, this agricultural land offers excellent long-term value with high soil fertility and water resources."
},
{
  _id: "agri-indore-009",
  title: "Agricultural Land in Simrol",
  description:
    "Scenic agricultural land surrounded by hills, ideal for organic and horticulture farming.",
  price: 17000000,
  propertyType: "Agricultural Land",
  address: "Village Simrol, Indore, Madhya Pradesh",
  images: [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
  ],
  sellerId: null,
  status: "approved",
  createdAt: "2026-01-22T06:24:49.160Z",
  updatedAt: "2026-01-22T08:35:07.220Z",
  location: {
    type: "Point",
    coordinates: [75.92, 22.52]
  },

  landSize: "7 Acres",
  totalImages: 2,
  media: {
    gallery: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
    ],
    videoUrl: ""
  },
  owner: {
    name: "Arjun Pawar",
    phone: "+91 99770 55667"
  },
  agent: {
    name: "Neha Kulkarni",
    phone: "+91 79995 33445",
    email: "neha.kulkarni@realty.com",
    address: "Bicholi Mardana, Indore, MP",
    image: "https://randomuser.me/api/portraits/women/41.jpg"
  },
  highlights: {
    landType: "Agricultural",
    waterAvailability: true,
    electricityAvailable: false,
    roadAccess: true,
    soilType: "Red-Black Mixed Soil"
  },
  aboutProperty:
    "Located in the scenic Simrol region, this land is perfect for organic farming, floriculture, and long-term agricultural investment."
},
{
  _id: "agri-indore-010",
  title: "Agricultural Land in Tillor Khurd",
  description:
    "Premium agricultural land with excellent connectivity, suitable for high-value crops and farmhouses.",
  price: 28000000,
  propertyType: "Agricultural Land",
  address: "Village Tillor Khurd, Indore, Madhya Pradesh",
  images: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
  ],
  sellerId: null,
  status: "approved",
  createdAt: "2026-01-22T06:24:49.160Z",
  updatedAt: "2026-01-22T08:35:07.230Z",
  location: {
    type: "Point",
    coordinates: [75.88, 22.66]
  },

  landSize: "6 Acres",
  totalImages: 2,
  media: {
    gallery: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
    ],
    videoUrl: ""
  },
  owner: {
    name: "Rajesh Tomar",
    phone: "+91 98266 77889"
  },
  agent: {
    name: "Manish Gupta",
    phone: "+91 79997 55667",
    email: "manish.gupta@realty.com",
    address: "LIG Square, Indore, MP",
    image: "https://randomuser.me/api/portraits/men/58.jpg"
  },
  highlights: {
    landType: "Agricultural",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    soilType: "Rich Black Soil"
  },
  aboutProperty:
    "Situated in Tillor Khurd, this land offers premium location advantages near Indore, making it suitable for high-yield farming as well as farmhouse development."
}





]
