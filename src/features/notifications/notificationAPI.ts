import api from "../../lib/apiClient";
import type { AppNotification, NotificationType } from "./notificationTypes";

type NotificationListResponse = {
  notifications: AppNotification[];
  unreadCount: number;
};

export const fetchNotificationsAPI = async (
  userId: string
): Promise<NotificationListResponse> => {
  const res = await api.get(`/notifications/${userId}`);
  return res.data?.data ?? { notifications: [], unreadCount: 0 };
};

export const markNotificationReadAPI = async (
  id: string
): Promise<AppNotification> => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data?.data;
};

export const clearReadNotificationsAPI = async (
  userId: string
): Promise<{ deletedCount: number }> => {
  const res = await api.delete(`/notifications/${userId}/read`);
  return res.data?.data ?? { deletedCount: 0 };
};

export const createNotificationAPI = async (payload: {
  title: string;
  message: string;
  type: NotificationType;
  receiverId: string;
  propertyId?: string;
}) => {
  const res = await api.post("/notifications", payload);
  return res.data?.data;
};
