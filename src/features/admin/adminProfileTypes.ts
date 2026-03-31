export type ThemePreference = "light" | "dark";

export type AdminProfileData = {
  basicInfo: {
    fullName: string;
    email: string;
    phone: string;
    profileImage: string;
  };
  security: {
    passwordMasked: string;
  };
  professional: {
    role: string;
    experience: string;
    department: string;
  };
  address: {
    country: string;
    state: string;
    city: string;
    zipCode: string;
  };
  preferences: {
    theme: ThemePreference;
    notifications: boolean;
  };
  activity: {
    lastLogin: string | null;
    accountCreated: string | null;
  };
  media: {
    profileImage: string;
    otherDocuments: string[];
  };
};

export type AdminProfileSection =
  | "basicInfo"
  | "security"
  | "professional"
  | "address"
  | "preferences"
  | "media";

export type ProfileExtrasPayload = {
  profileImage?: string;
  experience?: string;
  department?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  theme?: ThemePreference;
  notifications?: boolean;
  documents?: string[];
};
