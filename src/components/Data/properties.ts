
export interface Property {
  _id: string;
  title: string;
  description: string;
  aboutProperty?: string;
  price: number;
  propertyType: string; // "Villa"|"Commercial"|"Flat"|"Farmhouse"|"Agriculture Land"|"Resort"|"Rent Farmhouse"
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
  // ── fields the filter card needs ──
  size: number;               // sqft  OR  acres  (see isSizeInAcres)
  beds: number;
  baths: number;
  parking: number;
  distanceFromIndore: number; // km
  tags: string[];             // ["Hot"|"Popular"|"Latest"|"Premium"]
  landSize?: string;

  /* ✅ REQUIRED FOR PropertyPreview (ADDED ONLY) */
  agent?: {
    name: string;
    phone: string;
    email: string;
    image: string;
  };

  media?: {
    gallery: string[];
     videoUrl?: string;
  };

  highlights?: {
    soilType: string;
    waterAvailability: boolean;
    electricityAvailable: boolean;
    roadAccess: boolean;
    landType: string;
  };
}

// Returns true when this propertyType's size is in Acres
export function isSizeInAcres(propertyType: string): boolean {
  return propertyType === "Agriculture Land";
}


// ─── Data ─────────────────────────────────────────────────────────────────────
export const properties: Property[] = [



  // ── Farmhouse ──
 {
  _id: "prop_farm_01",
  title: "Countryside Farmhouse Near Mhow",
  description: "Stunning 3 BHK farmhouse on 1.5 acres with lush greenery and open verandas.",
  aboutProperty:
    "Stunning 3 BHK farmhouse on 1.5 acres with lush greenery and open verandas. Ideal for weekend stays, family gatherings, and peaceful countryside living.",
  price: 22000000,
  propertyType: "Farmhouse",
  address: "Mhow – NH-3, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1770090288856-7729ed4294a1?q=80&w=2042&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
  ],

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1770090288856-7729ed4294a1?q=80&w=2042&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "3800 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-01-26T07:00:00.000Z",
  updatedAt: "2026-01-26T09:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.70, 22.55]
  },

  size: 3800,
  beds: 3,
  baths: 2,
  parking: 2,
  distanceFromIndore: 35,
  tags: ["Premium", "Hot"],

  agent: {
    name: "Ravi Properties",
    phone: "+91 98765 43219",
    email: "info@raviproperties.com",
    image: "https://randomuser.me/api/portraits/men/11.jpg"

  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Farmhouse"
  }
},

 {
  _id: "prop_farm_02",
  title: "Eco Farmhouse in Sanand",
  description: "Eco-friendly farmhouse with solar panels and organic gardens.",
  price: 18500000,
  propertyType: "Farmhouse",
  address: "Sanand – Near Indore, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1519082572439-7ed19908e47e?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  /* ✅ ADDED */
  aboutProperty:
    "Eco-friendly farmhouse featuring solar panels, organic gardens, and a peaceful natural environment. Ideal for sustainable living and weekend retreats.",

  /* ✅ ADDED */
  media: {
    gallery: [
      "https://images.unsplash.com/photo-1519082572439-7ed19908e47e?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    videoUrl: "https://cdn.videvo.net/videvo_files/video/free/2019-07/small_watermarked/190620_02_Aerial_4k_002_preview.webm"

  },

  /* ✅ ADDED */
  landSize: "2900 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-01-27T06:00:00.000Z",
  updatedAt: "2026-01-27T08:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.75, 22.60]
  },

  size: 2900,
  beds: 2,
  baths: 2,
  parking: 2,
  distanceFromIndore: 28,
  tags: ["Latest", "Popular"],

  /* ✅ ADDED */
  agent: {
    name: "Green Acres Realty",
    phone: "+91 91234 56789",
    email: "contact@greenacresrealty.com",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },

  /* ✅ ADDED */
  highlights: {
    soilType: "Mixed Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Farmhouse"
  }
},

  {
  _id: "prop_farm_03",
  title: "Heritage Farmhouse in Dewas",
  description: "Restored heritage farmhouse with traditional architecture and modern amenities.",
  price: 32000000,
  propertyType: "Farmhouse",
  address: "Dewas – Heritage District, Madhya Pradesh",

  images: [
    "https://plus.unsplash.com/premium_photo-1674624682232-c9ced5360a2e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  /* ✅ ADDED */
  aboutProperty:
    "Beautifully restored heritage farmhouse showcasing traditional architecture blended with modern amenities. Ideal for luxury countryside living and heritage lovers.",

  /* ✅ ADDED */
  media: {
    gallery: [
      "https://plus.unsplash.com/premium_photo-1674624682232-c9ced5360a2e?q=80&w=1170&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  /* ✅ ADDED */
  landSize: "5200 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-01-28T07:00:00.000Z",
  updatedAt: "2026-01-28T09:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [76.05, 22.96]
  },

  size: 5200,
  beds: 4,
  baths: 3,
  parking: 3,
  distanceFromIndore: 42,
  tags: ["Premium"],

  /* ✅ ADDED */
  agent: {
    name: "Heritage Realty",
    phone: "+91 99887 66554",
    email: "sales@heritagerealty.com",
    image: "https://randomuser.me/api/portraits/men/33.jpg"
  },

  /* ✅ ADDED */
  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Heritage Farmhouse"
  }
},

  {
  _id: "prop_farm_04",
  title: "Modern Farmhouse in Simrol",
  description: "Contemporary farmhouse with infinity pool and outdoor entertainment area.",
  price: 26500000,
  propertyType: "Farmhouse",
  address: "Simrol – Indore Road, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  ],

  /* ✅ ADDED */
  aboutProperty:
    "Modern farmhouse featuring contemporary architecture, an infinity pool, and a spacious outdoor entertainment area. Ideal for luxury living and weekend getaways.",

  /* ✅ ADDED */
  media: {
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  /* ✅ ADDED */
  landSize: "4100 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-01-29T08:00:00.000Z",
  updatedAt: "2026-01-29T10:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.68, 22.68]
  },

  size: 4100,
  beds: 3,
  baths: 3,
  parking: 3,
  distanceFromIndore: 25,
  tags: ["Hot", "Latest"],

  /* ✅ ADDED */
  agent: {
    name: "Urban Edge Realty",
    phone: "+91 90123 45678",
    email: "contact@urbanedgerealty.com",
    image: "https://randomuser.me/api/portraits/men/44.jpg"

  },

  /* ✅ ADDED */
  highlights: {
    soilType: "Mixed Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Modern Farmhouse"
  }
},


   {
  _id: "prop_farm_05",
  title: "Modern Farmhouse in Khandwa",
  description: "Natural farmhouse with exploration of nature and pure air.",
  price: 10000000,
  propertyType: "Farmhouse",
  address: "Khandwa – khadwa Road, Madhya Pradesh",

  images: [
    "https://plus.unsplash.com/premium_photo-1733760180239-ef05b25dd5ad?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  /* ✅ ADDED */
  aboutProperty:
    "Natural farmhouse surrounded by greenery, offering fresh air and a peaceful environment. Ideal for nature lovers, relaxation, and countryside living.",

  /* ✅ ADDED */
  media: {
    gallery: [
      "https://plus.unsplash.com/premium_photo-1733760180239-ef05b25dd5ad?q=80&w=2071&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  /* ✅ ADDED */
  landSize: "40000 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-01-29T08:00:00.000Z",
  updatedAt: "2026-01-29T10:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.68, 22.68]
  },

  size: 40000,
  beds: 3,
  baths: 3,
  parking: 3,
  distanceFromIndore: 185,
  tags: ["Hot", "Latest", "Popular"],

  /* ✅ ADDED */
  agent: {
    name: "NatureNest Realty",
    phone: "+91 93456 78901",
    email: "info@naturenestrealty.com",
    image: "https://randomuser.me/api/portraits/men/55.jpg"
  },

  /* ✅ ADDED */
  highlights: {
    soilType: "Red Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Farmhouse"
  }
},

 {
  _id: "prop_farm_07",
  title: "Luxury Farmhouse with Private Garden",
  description:
    "A beautifully designed farmhouse surrounded by greenery, offering a peaceful lifestyle away from the city. Perfect for weekend stays, family gatherings, and nature lovers.",
  price: 6500000,
  propertyType: "Farmhouse",
  address:
    "Near Mandideep Industrial Area, Hoshangabad Road, Bhopal, Madhya Pradesh – 462046",

  images: [
    "https://images.unsplash.com/photo-1534073133331-c4b62a557083?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Luxury farmhouse featuring a private garden and lush green surroundings. Designed for comfort and tranquility, ideal for premium living, weekend retreats, and family gatherings.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1534073133331-c4b62a557083?q=80&w=2070&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "40000 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-01-29T08:00:00.000Z",
  updatedAt: "2026-01-29T10:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.68, 22.68]
  },

  size: 40000,
  beds: 3,
  baths: 3,
  parking: 3,
  distanceFromIndore: 185,
  tags: ["Premium"],

  agent: {
    name: "Elite Homes Realty",
    phone: "+91 94567 12345",
    email: "sales@elitehomesrealty.com",
    image: "https://randomuser.me/api/portraits/women/12.jpg"
  },

  highlights: {
    soilType: "Mixed Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Luxury Farmhouse"
  }
},

   {
  _id: "prop_farm_08",
  title: "Serene Farmhouse Near Highway",
  description:
    "Spacious farmhouse located close to the main highway with easy access to the city. Features open lawns, ample parking, and a calm environment for relaxation.",
  price: 4500000,
  propertyType: "Farmhouse",
  address: "Village Sehore Road, NH-46, Sehore, Madhya Pradesh – 466001",

  images: [
    "https://plus.unsplash.com/premium_photo-1685133855379-711aa008f7ba?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Serene farmhouse located near the highway, offering excellent connectivity along with peaceful surroundings. Features spacious open lawns, ample parking, and an ideal environment for relaxation and family gatherings.",

  media: {
    gallery: [
      "https://plus.unsplash.com/premium_photo-1685133855379-711aa008f7ba?q=80&w=1974&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "39000 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-01-29T08:00:00.000Z",
  updatedAt: "2026-01-29T10:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.68, 22.68]
  },

  size: 39000,
  beds: 3,
  baths: 3,
  parking: 3,
  distanceFromIndore: 185,
  tags: ["Premium"],

  agent: {
    name: "Highway Homes Realty",
    phone: "+91 95678 23456",
    email: "info@highwayhomesrealty.com",
    image: "https://randomuser.me/api/portraits/women/23.jpg"
  },

  highlights: {
    soilType: "Mixed Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Farmhouse"
  }
},


  // ── Agriculture Land  ← size is in ACRES here ──
  {
  _id: "prop_agri_01",
  title: "Fertile Land Near Ujjain Road",
  description: "Rich black-soil plot ideal for wheat and soybean. Bore-well available.",
  price: 12000000,
  propertyType: "Agriculture Land",
  address: "Indore – Ujjain Road, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1591389703635-e15a07b842d7?q=80&w=1933&auto=format&fit=crop"
  ],

  aboutProperty:
    "Highly fertile agricultural land with rich black soil, suitable for crops like wheat and soybean. Equipped with a bore-well and located near Ujjain Road for easy transportation and market access.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1591389703635-e15a07b842d7?q=80&w=1933&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

 
  landSize: "50 Acres",

  sellerId: null,
  status: "approved",
  createdAt: "2026-01-28T05:00:00.000Z",
  updatedAt: "2026-01-28T07:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.78, 22.82]
  },

  size: 50,
  beds: 0,
  baths: 0,
  parking: 0,
  distanceFromIndore: 22,
  tags: ["Popular"],

  agent: {
    name: "Kisan Bhoomi Realty",
    phone: "+91 98760 11223",
    email: "info@kisanbhoomirealty.com",
    image: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

 {
  _id: "prop_agri_02",
  title: "Premium Agri Plot in Dhar",
  description: "Large irrigated plot with road access and electricity.",
  price: 8500000,
  propertyType: "Agriculture Land",
  address: "Dhar – Near NH-3, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1587745890135-20db8c79b027?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],


  aboutProperty:
    "Premium agricultural land with reliable irrigation, road connectivity, and electricity availability. Ideal for commercial farming and long-term agricultural investment.",


  media: {
    gallery: [
      "https://images.unsplash.com/photo-1587745890135-20db8c79b027?q=80&w=2070&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "31.5 Acres",

  sellerId: null,
  status: "approved",
  createdAt: "2026-01-29T04:00:00.000Z",
  updatedAt: "2026-01-29T06:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.30, 22.60]
  },

  size: 31.5,
  beds: 0,
  baths: 0,
  parking: 0,
  distanceFromIndore: 55,
  tags: ["Hot", "Latest"],

  agent: {
    name: "Dhar Agro Realty",
    phone: "+91 97654 32109",
    email: "sales@dharagrorealty.com",
    image: "https://randomuser.me/api/portraits/men/33.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

  {
  _id: "prop_agri_03",
  title: "Small Farm Near Betul",
  description: "Compact plot surrounded by forests. Great for organic farming.",
  price: 4200000,
  propertyType: "Agriculture Land",
  address: "Betul – Forest Edge, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Small agricultural plot nestled near forested areas, offering a clean and natural environment. Ideal for organic farming, eco-friendly projects, and sustainable agriculture practices.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=2071&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "5 Acres",

  sellerId: null,
  status: "approved",
  createdAt: "2026-01-30T03:00:00.000Z",
  updatedAt: "2026-01-30T05:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [77.90, 21.70]
  },

  size: 5,
  beds: 0,
  baths: 0,
  parking: 0,
  distanceFromIndore: 90,
  tags: ["Latest", "Hot"],

  agent: {
    name: "GreenGrow Agro Realty",
    phone: "+91 98123 45067",
    email: "info@greengrowagro.com",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },

  highlights: {
    soilType: "Red Soil",
    waterAvailability: true,
    electricityAvailable: false,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

  {
  _id: "prop_agri_04",
  title: "Large Agricultural Plot in Khargone",
  description: "Expansive 10-acre land with canal irrigation and farm equipment shed.",
  price: 25000000,
  propertyType: "Agriculture Land",
  address: "Khargone – Main Road, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449"
  ],

  aboutProperty:
    "Large agricultural land spanning 10 acres with reliable canal irrigation and a dedicated shed for farm equipment. Ideal for high-yield farming and large-scale agricultural operations.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "10 Acres",

  sellerId: null,
  status: "approved",
  createdAt: "2026-01-31T04:00:00.000Z",
  updatedAt: "2026-01-31T06:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.61, 21.82]
  },

  size: 10,
  beds: 0,
  baths: 0,
  parking: 0,
  distanceFromIndore: 85,
  tags: ["Premium", "Popular"],

  agent: {
    name: "Krushi Bhumi Realty",
    phone: "+91 98987 65432",
    email: "contact@krushibhumirealty.com",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

 {
  _id: "prop_agri_05",
  title: "Mango Orchard in Pithampur",
  description: "7-acre established mango orchard with regular income and farmhouse.",
  price: 18000000,
  propertyType: "Agriculture Land",
  address: "Pithampur – Industrial Area, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399"
  ],

  aboutProperty:
    "Well-established mango orchard spread across fertile agricultural land, offering regular seasonal income. Includes a farmhouse and is ideal for agri-investors and orchard farming.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },


  landSize: "70 Acres",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-01T05:00:00.000Z",
  updatedAt: "2026-02-01T07:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.69, 22.60]
  },

  size: 70,
  beds: 0,
  baths: 0,
  parking: 0,
  distanceFromIndore: 32,
  tags: ["Hot", "Premium"],

  agent: {
    name: "Orchard Prime Realty",
    phone: "+91 93210 45678",
    email: "sales@orchardprimerealty.com",
    image: "https://randomuser.me/api/portraits/men/33.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

  {
  _id: "prop_agri_06",
  title: "Riverfront Agricultural Land",
  description: "Beautiful 4-acre plot along river with year-round water availability.",
  price: 15500000,
  propertyType: "Agriculture Land",
  address: "Rau – Riverfront, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
  ],

  aboutProperty:
    "Scenic riverfront agricultural land offering year-round water availability. Ideal for farming, orchards, and eco-friendly agricultural projects with natural irrigation advantages.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "56 Acres",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-02T04:00:00.000Z",
  updatedAt: "2026-02-02T06:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.72, 22.65]
  },

  size: 56,
  beds: 0,
  baths: 0,
  parking: 0,
  distanceFromIndore: 18,
  tags: ["Popular", "Latest"],

  agent: {
    name: "RiverEdge Agro Realty",
    phone: "+91 97865 43210",
    email: "info@riveredgeagro.com",
    image: "https://randomuser.me/api/portraits/men/44.jpg"
  },

  highlights: {
    soilType: "Alluvial Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

  {
  _id: "prop_agri_07",
  title: "Open Agricultural Land with Road Access",
  description:
    "Fully cultivable land with clear boundaries and good soil texture. Ideal for growing wheat, soybean, and pulses.",
  price: 800000,
  propertyType: "Agriculture Land",
  address:
    "Village Sultanpur, Vidisha Road, Vidisha District, Madhya Pradesh – 464001",

  images: [
    "https://images.unsplash.com/photo-1497094249532-36ecba33f9ff?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Open and fully cultivable agricultural land with clear boundaries and good soil quality. Well-suited for crops like wheat, soybean, and pulses, with direct road access for easy transportation.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1497094249532-36ecba33f9ff?q=80&w=2074&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "37 Acres",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-02T04:00:00.000Z",
  updatedAt: "2026-02-02T06:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.72, 22.65]
  },

  size: 37,
  beds: 0,
  baths: 0,
  parking: 0,
  distanceFromIndore: 18,
  tags: ["Popular", "Premium"],

  agent: {
    name: "Vidisha Agro Realty",
    phone: "+91 96234 78901",
    email: "contact@vidishaagrorealty.com",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },

  highlights: {
    soilType: "Loamy Soil",
    waterAvailability: true,
    electricityAvailable: false,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

   {
  _id: "prop_agri_08",
  title: "Cultivable Agricultural Land for Sale",
  description:
    "Spacious agricultural land with direct road access, making movement of machinery and produce easy. Suitable for farming and land banking.",
  price: 12700000,
  propertyType: "Agriculture Land",
  address:
    "Village Ichhawar, Ichhawar Tehsil, Sehore District, Madhya Pradesh – 466115",

  images: [
    "https://images.unsplash.com/photo-1609226511778-60c277756b6e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Cultivable agricultural land with excellent road connectivity, allowing easy movement of farm machinery and produce. Suitable for active farming as well as long-term land banking investment.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1609226511778-60c277756b6e?q=80&w=1974&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "78 Acres",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-02T04:00:00.000Z",
  updatedAt: "2026-02-02T06:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.72, 22.65]
  },

  size: 78,
  beds: 0,
  baths: 0,
  parking: 0,
  distanceFromIndore: 18,
  tags: ["Hot"],

  agent: {
    name: "Sehore Agro Realty",
    phone: "+91 98456 12309",
    email: "sales@sehoreagrorealty.com",
    image: "https://randomuser.me/api/portraits/men/33.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},


  // ── Resort ──
  {
  _id: "prop_resort_01",
  title: "Lakeside Resort in Panna",
  description: "Luxury 4-BHK resort-style property overlooking a private lake.",
  price: 42000000,
  propertyType: "Resort",
  address: "Panna – Lakeside, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1744307679140-f4abf4a9bd01?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
  ],

  aboutProperty:
    "Luxury lakeside resort offering a premium 4-BHK layout with scenic lake views. Designed for high-end hospitality, leisure stays, and private retreats, surrounded by natural beauty and tranquility.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1744307679140-f4abf4a9bd01?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  landSize: "8500 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-01-31T02:00:00.000Z",
  updatedAt: "2026-01-31T04:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [79.87, 24.72]
  },

  size: 8500,
  beds: 4,
  baths: 3,
  parking: 4,
  distanceFromIndore: 120,
  tags: ["Premium", "Popular"],

  agent: {
    name: "Royal Retreats Realty",
    phone: "+91 98234 56780",
    email: "sales@royalretreatsrealty.com",
    image: "https://randomuser.me/api/portraits/men/44.jpg"
  },

  highlights: {
  soilType: "Black Soil",
  waterAvailability: true,
  electricityAvailable: true,
  roadAccess: true,
  landType: "Agricultural Land"
}

},

  {
  _id: "prop_resort_02",
  title: "Hill-Top Resort in Pachmarhi",
  description: "Serene hill-top property with panoramic views and 3 guest suites.",
  price: 31000000,
  propertyType: "Resort",
  address: "Pachmarhi – Hill Station, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1763446365381-af606c46d1af?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Hill-top resort located in Pachmarhi offering panoramic views, fresh mountain air, and three well-designed guest suites. Ideal for hospitality business, luxury stays, and nature retreats.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1763446365381-af606c46d1af?q=80&w=1975&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "6800 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-01T01:00:00.000Z",
  updatedAt: "2026-02-01T03:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [78.43, 22.70]
  },

  size: 6800,
  beds: 3,
  baths: 3,
  parking: 3,
  distanceFromIndore: 95,
  tags: ["Hot"],

  agent: {
    name: "HillView Resorts Realty",
    phone: "+91 97123 45678",
    email: "sales@hillviewresorts.com",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

 {
  _id: "prop_resort_03",
  title: "Boutique Resort in Maheshwar",
  description:
    "Heritage resort with river view and 8 luxury rooms for boutique hospitality.",
  price: 55000000,
  propertyType: "Resort",
  address: "Maheshwar – Narmada Ghat, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"
  ],

  aboutProperty:
    "Premium boutique heritage resort located on the banks of the Narmada River in Maheshwar. Features eight luxury rooms, river views, and traditional architecture, ideal for high-end hospitality and cultural tourism.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "12000 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-02T02:00:00.000Z",
  updatedAt: "2026-02-02T04:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.59, 22.17]
  },

  size: 12000,
  beds: 8,
  baths: 8,
  parking: 10,
  distanceFromIndore: 91,
  tags: ["Premium", "Hot"],

  agent: {
    name: "Narmada Heritage Realty",
    phone: "+91 98876 54321",
    email: "sales@narmadaheritagerealty.com",
    image: "https://randomuser.me/api/portraits/men/33.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

  {
  _id: "prop_resort_04",
  title: " Resort in Mandleshwar",
  description:
    "Heritage resort with river view and 8 luxury rooms for boutique hospitality.",
  price: 58000000,
  propertyType: "Resort",
  address: "Mandleshwar –  Near fort, Madhya Pradesh",

  images: [
    "https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Heritage-style resort located near the historic fort area of Mandleshwar. Offers river views and luxury accommodation designed for boutique hospitality and premium tourism experiences.",

  media: {
    gallery: [
      "https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?q=80&w=2071&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "78000 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-02T02:00:00.000Z",
  updatedAt: "2026-02-02T04:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.59, 22.17]
  },

  size: 78000,
  beds: 8,
  baths: 8,
  parking: 10,
  distanceFromIndore: 91,
  tags: ["Premium", "Hot"],

  agent: {
    name: "Mandleshwar Heritage Realty",
    phone: "+91 98765 90876",
    email: "sales@mandleshwarheritagerealty.com",
    image: "https://randomuser.me/api/portraits/men/44.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

  {
  _id: "prop_resort_05",
  title: " Resort in Mandleshwar",
  description:
    "Heritage resort with river view and 8 luxury rooms for boutique hospitality.",
  price: 6000000,
  propertyType: "Resort",
  address: "Mandleshwar –  Near fort, Madhya Pradesh",

  images: [
    "https://plus.unsplash.com/premium_photo-1682913629540-3857602b540c?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Heritage-style resort located near the historic fort area of Mandleshwar, offering river views and premium accommodation. Suitable for boutique hospitality, tourism ventures, and leisure stays.",


  media: {
    gallery: [
      "https://plus.unsplash.com/premium_photo-1682913629540-3857602b540c?q=80&w=2080&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "15000 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-02T02:00:00.000Z",
  updatedAt: "2026-02-02T04:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.59, 22.17]
  },

  size: 15000,
  beds: 8,
  baths: 8,
  parking: 10,
  distanceFromIndore: 91,
  tags: ["Premium", "Hot"],

  agent: {
    name: "Mandleshwar Riverside Realty",
    phone: "+91 98111 22334",
    email: "sales@mandleshwarriversiderealty.com",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

 {
  _id: "prop_resort_06",
  title: " Green Valley Luxury Resort",
  description:
    "A premium resort surrounded by lush greenery, offering spacious rooms, a swimming pool, and modern amenities. Ideal for family vacations, destination weddings, and corporate retreats.",
  price: 8000000,
  propertyType: "Resort",
  address:
    "Near Kerwa Dam Road, Kaliasot Area, Bhopal, Madhya Pradesh – 462038",

  images: [
    "https://plus.unsplash.com/premium_photo-1682285212027-6af0d0f70e07?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Green Valley Luxury Resort is a premium hospitality property set amidst lush greenery near Kerwa Dam. It offers spacious rooms, a swimming pool, and modern amenities, making it ideal for family vacations, destination weddings, and corporate retreats.",

  media: {
    gallery: [
      "https://plus.unsplash.com/premium_photo-1682285212027-6af0d0f70e07?q=80&w=1974&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "15000 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-02T02:00:00.000Z",
  updatedAt: "2026-02-02T04:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.59, 22.17]
  },

  size: 15000,
  beds: 8,
  baths: 8,
  parking: 10,
  distanceFromIndore: 91,
  tags: ["Premium", "Hot"],

  agent: {
    name: "Green Valley Hospitality Realty",
    phone: "+91 98734 56120",
    email: "sales@greenvalleyhospitality.com",
    image: "https://randomuser.me/api/portraits/men/55.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

  {
  _id: "prop_resort_07",
  title: " Royal Heritage Resort",
  description:
    "A heritage-style resort with royal architecture, modern interiors, and premium hospitality services. Suitable for weddings, cultural events, and luxury stays.",
  price: 89000000,
  propertyType: "Resort",
  address:
    "Village Bhojpur Road, Raisen District, Madhya Pradesh – 464551",

  images: [
    "https://plus.unsplash.com/premium_photo-1733342441106-96a5e23b2c9f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Royal Heritage Resort showcases grand heritage-style architecture blended with modern interiors and premium hospitality services. An ideal destination for weddings, cultural events, luxury stays, and high-end tourism experiences.",


  media: {
    gallery: [
      "https://plus.unsplash.com/premium_photo-1733342441106-96a5e23b2c9f?q=80&w=2070&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "32000 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-02T02:00:00.000Z",
  updatedAt: "2026-02-02T04:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.59, 22.17]
  },

  size: 32000,
  beds: 8,
  baths: 8,
  parking: 10,
  distanceFromIndore: 91,
  tags: ["Premium", "Hot"],

  agent: {
    name: "Royal Crown Hospitality Realty",
    phone: "+91 99012 34567",
    email: "sales@royalcrownhospitality.com",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

 {
  _id: "prop_resort_08",
  title: "Palm Grove Weekend Resort",
  description:
    "A modern weekend resort with landscaped gardens, a poolside restaurant, and indoor-outdoor recreational facilities. Suitable for short stays and celebrations.",
  price: 65000000,
  propertyType: "Resort",
  address:
    "Indore–Ujjain Highway, Near Manglia Toll Plaza, Indore District, Madhya Pradesh – 453771",

  images: [
    "https://plus.unsplash.com/premium_photo-1681922761648-d5e2c3972982?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Palm Grove Weekend Resort is a modern hospitality property featuring landscaped gardens, a poolside restaurant, and indoor-outdoor recreational facilities. Ideal for weekend getaways, short stays, private celebrations, and social events.",

  media: {
    gallery: [
      "https://plus.unsplash.com/premium_photo-1681922761648-d5e2c3972982?q=80&w=2070&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "16000 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-02T02:00:00.000Z",
  updatedAt: "2026-02-02T04:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.59, 22.17]
  },

  size: 16000,
  beds: 8,
  baths: 8,
  parking: 10,
  distanceFromIndore: 91,
  tags: ["Premium", "Hot"],

  agent: {
    name: "Palm Grove Hospitality Realty",
    phone: "+91 98345 67890",
    email: "sales@palmgrovehospitality.com",
    image: "https://randomuser.me/api/portraits/men/33.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},
  // ── Rent Farmhouse ──
  {
  _id: "prop_rentfarm_01",
  title: "Rent – Weekend Farmhouse in Mhow",
  description:
    "Fully furnished farmhouse for short or long stays. Pool included.",
  price: 45000,
  propertyType: "Rent Farmhouse",
  address: "Mhow – Countryside, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1761591672163-abaa765eb459?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Fully furnished weekend farmhouse available for rent in the peaceful countryside of Mhow. Suitable for short stays, long stays, family getaways, and private celebrations. Includes a swimming pool and modern amenities.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1761591672163-abaa765eb459?q=80&w=2070&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "2200 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T02:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.72, 22.53]
  },

  size: 2200,
  beds: 2,
  baths: 2,
  parking: 2,
  distanceFromIndore: 30,
  tags: ["Popular", "Latest"],

  agent: {
    name: "Mhow Weekend Rentals",
    phone: "+91 98765 44321",
    email: "rentals@mhowweekendrentals.com",
    image: "https://randomuser.me/api/portraits/men/55.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

  {
  _id: "prop_rentfarm_02",
  title: "Rent – Luxury Farmhouse in Sanand",
  description:
    "Premium rental with 4 bedrooms, modular kitchen, private orchard.",
  price: 75000,
  propertyType: "Rent Farmhouse",
  address: "Sanand – Lush Valley, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1935&auto=format&fit=crop"
  ],

  aboutProperty:
    "Luxury farmhouse available for rent in Sanand featuring four bedrooms, a modular kitchen, and a private orchard. Ideal for premium living, long stays, and family getaways.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1935&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "3600 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-02T00:00:00.000Z",
  updatedAt: "2026-02-02T02:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.76, 22.62]
  },

  size: 3600,
  beds: 4,
  baths: 3,
  parking: 3,
  distanceFromIndore: 26,
  tags: ["Premium"],

  agent: {
    name: "Sanand Luxury Rentals",
    phone: "+91 98901 23456",
    email: "rentals@sanandluxuryrentals.com",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

  {
  _id: "prop_rentfarm_03",
  title: "Rent – Budget Farmhouse in Rau",
  description:
    "Affordable farmhouse rental with basic amenities and large garden space.",
  price: 25000,
  propertyType: "Rent Farmhouse",
  address: "Rau – Village Road, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
  ],

  aboutProperty:
    "Budget-friendly farmhouse available for rent in Rau with basic amenities and a spacious garden area. Suitable for small families, short stays, and peaceful countryside living.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },


  landSize: "1800 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-03T00:00:00.000Z",
  updatedAt: "2026-02-03T02:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.73, 22.66]
  },

  size: 1800,
  beds: 2,
  baths: 1,
  parking: 2,
  distanceFromIndore: 20,
  tags: ["Latest"],

 
  agent: {
    name: "Rau Budget Rentals",
    phone: "+91 97654 89012",
    email: "info@raubudgetrentals.com",
    image: "https://randomuser.me/api/portraits/men/44.jpg"
  },


  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

  {
  _id: "prop_rentfarm_04",
  title: "Rent – Party Farmhouse in Simrol",
  description:
    "Large event-ready farmhouse with DJ setup, swimming pool, and seating for 100.",
  price: 95000,
  propertyType: "Rent Farmhouse",
  address: "Simrol – Event Zone, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d"
  ],


  aboutProperty:
    "Event-ready farmhouse available for rent in Simrol, featuring a DJ setup, swimming pool, and seating capacity for up to 100 guests. Ideal for parties, celebrations, and private events.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "5000 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-04T00:00:00.000Z",
  updatedAt: "2026-02-04T02:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.69, 22.67]
  },

  size: 5000,
  beds: 3,
  baths: 4,
  parking: 15,
  distanceFromIndore: 24,
  tags: ["Premium", "Hot"],

  agent: {
    name: "Simrol Event Rentals",
    phone: "+91 98123 66789",
    email: "events@simroleventrentals.com",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

  {
  _id: "prop_rentfarm_04",
  title: "Rent – Party Farmhouse in Simrol",
  description:
    "Large event-ready farmhouse with DJ setup, swimming pool, and seating for 100.",
  price: 95000,
  propertyType: "Rent Farmhouse",
  address: "Simrol – Event Zone, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d"
  ],

  aboutProperty:
    "Event-ready farmhouse available for rent in Simrol, featuring a DJ setup, swimming pool, and seating capacity for up to 100 guests. Ideal for parties, celebrations, and private events.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "5000 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-04T00:00:00.000Z",
  updatedAt: "2026-02-04T02:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.69, 22.67]
  },

  size: 5000,
  beds: 3,
  baths: 4,
  parking: 15,
  distanceFromIndore: 24,
  tags: ["Premium", "Hot"],

  agent: {
    name: "Simrol Event Rentals",
    phone: "+91 98123 66789",
    email: "events@simroleventrentals.com",
    image: "https://randomuser.me/api/portraits/men/55.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

 {
  _id: "prop_rentfarm_06",
  title: "Rent – Silver Fern Retreat",
  description:
    "A calm and elegant resort designed for private stays and celebrations, featuring open lawns, poolside seating, and premium rooms.",
  price: 42000,
  propertyType: "Rent Farmhouse",
  address: "Simrol – Event Zone, Madhya Pradesh",

  images: [
    "https://images.unsplash.com/photo-1693933714044-131908e39427?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Silver Fern Retreat is a calm and elegant farmhouse available for rent in Simrol. Designed for private stays and celebrations, it features open lawns, poolside seating, and premium rooms.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1693933714044-131908e39427?q=80&w=1974&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "16800 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-04T00:00:00.000Z",
  updatedAt: "2026-02-04T02:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.69, 22.67]
  },

  size: 16800,
  beds: 3,
  baths: 4,
  parking: 15,
  distanceFromIndore: 24,
  tags: ["Popular"],

  agent: {
    name: "Silver Fern Rentals",
    phone: "+91 98234 77654",
    email: "bookings@silverfernrentals.com",
    image: "https://randomuser.me/api/portraits/men/33.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

   {
  _id: "prop_rentfarm_07",
  title: "Rent – Amber Woods Resortt",
  description:
    "Lake-facing resort offering peaceful views, luxury cottages, and open gathering areas. Perfect for retreats and small destination weddings.",
  price: 65000,
  propertyType: "Rent Farmhouse",
  address:
    "Near Upper Lake, Van Vihar Road, Bhopal, Madhya Pradesh – 462002",

  images: [
    "https://images.unsplash.com/photo-1601701119533-fde20cecbf4e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Amber Woods Resort is a lake-facing farmhouse available for rent near Upper Lake, Bhopal. Offers serene views, luxury cottages, and open gathering areas, making it ideal for retreats and small destination weddings.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1601701119533-fde20cecbf4e?q=80&w=2071&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "26800 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-04T00:00:00.000Z",
  updatedAt: "2026-02-04T02:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.69, 22.67]
  },

  size: 26800,
  beds: 3,
  baths: 4,
  parking: 15,
  distanceFromIndore: 24,
  tags: ["Popular"],


  agent: {
    name: "Amber Woods Rentals",
    phone: "+91 99123 65478",
    email: "info@amberwoodsrentals.com",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },


  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
},

  {
  _id: "prop_rentfarm_08",
  title: "Rent – Crimson Court Event Resort",
  description:
    "A premium event-focused resort with banquet lawns and elegant architecture, suitable for weddings, receptions, and large celebrations.",
  price: 90000,
  propertyType: "Rent Farmhouse",
  address:
    "Sehore–Ashta Road, Sehore District, Madhya Pradesh – 466001",

  images: [
    "https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ],

  aboutProperty:
    "Crimson Court Event Resort is a premium event-focused farmhouse available for rent, featuring expansive banquet lawns and elegant architecture. Ideal for weddings, receptions, and large-scale celebrations.",

  media: {
    gallery: [
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=2070&auto=format&fit=crop"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  landSize: "38000 Sq. Ft.",

  sellerId: null,
  status: "approved",
  createdAt: "2026-02-04T00:00:00.000Z",
  updatedAt: "2026-02-04T02:00:00.000Z",

  location: {
    type: "Point",
    coordinates: [75.69, 22.67]
  },

  size: 38000,
  beds: 3,
  baths: 4,
  parking: 15,
  distanceFromIndore: 24,
  tags: ["Hot", "Latest"],

  agent: {
    name: "Crimson Court Event Rentals",
    phone: "+91 98765 11290",
    email: "events@crimsoncourtrentals.com",
    image: "https://randomuser.me/api/portraits/women/45.jpg"
  },

  highlights: {
    soilType: "Black Soil",
    waterAvailability: true,
    electricityAvailable: true,
    roadAccess: true,
    landType: "Agricultural Land"
  }
}


];
// Helper: grab only the types you need
export function getByType(...types: string[]) {
  return properties.filter((p) => types.includes(p.propertyType));
}
