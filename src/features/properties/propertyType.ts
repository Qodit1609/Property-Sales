export interface Property {
  _id: string;
  title: string;
  address: string;
  price: number;
  images: string[];
  propertyType: string;
  status?: string;
  size?: number;
  beds?: number | string;
  baths?: number | string;
  parking?: number | string;
  distanceFromIndore?: number;
  tags?: string[];
}
