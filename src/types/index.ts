
export type ThemeVariant = 'luxury' | 'bold' | 'soft' | 'minimal';

export interface ImageItem {
  id: string;
  url: string;
  caption?: string;
  tags?: string[];
  enhanced?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  rate: string;
  duration?: string;
}

export interface ProfileInfo {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  contactEmail: string;
  contactPhone?: string;
  whatsapp?: string;
  socials?: {
    twitter?: string;
    instagram?: string;
  };
}

export interface AvailabilityInfo {
  status: 'available' | 'limited' | 'unavailable';
  schedule: string; // Free text for now, could be structured later
  notes?: string;
}

export interface SiteConfig {
  id: string;
  theme: ThemeVariant;
  profile: ProfileInfo;
  services: ServiceItem[];
  gallery: ImageItem[];
  availability: AvailabilityInfo;
  heroImageId?: string;
}

export const DEFAULT_CONFIG: SiteConfig = {
  id: 'default',
  theme: 'luxury',
  profile: {
    name: 'Jane Doe',
    tagline: 'Exclusive & Elegant',
    bio: 'Professional companion for high-end events and private dinners.',
    location: 'New York, NY',
    contactEmail: 'jane@example.com',
  },
  services: [
    {
      id: '1',
      name: 'Dinner Date',
      description: 'A romantic evening at a fine dining establishment.',
      rate: '300',
      duration: '2 hours',
    },
  ],
  gallery: [],
  availability: {
    status: 'available',
    schedule: 'Mon-Fri: 6pm - 12am',
  },
};
