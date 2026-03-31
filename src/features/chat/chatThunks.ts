import { createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../services/chatService';
import { setNotifications, setUnreadCount } from './chatSlice';

export const syncUnreadSummary = createAsyncThunk(
  'chat/syncUnreadSummary',
  async (_, { dispatch }) => {
    const summary = await chatService.getUnreadSummary();
    dispatch(setUnreadCount(summary.unreadTotal));
    return summary;
  }
);

export const syncNotifications = createAsyncThunk(
  'chat/syncNotifications',
  async (_, { dispatch }) => {
    const result = await chatService.getNotifications(1, 20);
    dispatch(
      setNotifications(
        result.notifications.map((notification) => ({
          _id: notification._id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          referenceId: notification.referenceId,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
        }))
      )
    );
    dispatch(setUnreadCount(result.unreadCount));
    return result;
  }
);
