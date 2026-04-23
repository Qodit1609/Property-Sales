export type NotificationType =
  | "cart"
  | "property"
  | "approval"
  | "rejection"
  | "testimonial"
  | "promotion_request";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  senderId: string;
  receiverId: string;
  propertyId: string | null;
  isRead: boolean;
  createdAt: string;
}
