import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchNotifications, clearNotificationsState } from "./notificationSlice";

const POLL_INTERVAL_MS = 10000;

const NotificationSync = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      dispatch(clearNotificationsState());
      return;
    }

    const userId = String(user.id ?? user._id ?? "");
    if (!userId) return;

    dispatch(fetchNotifications(userId));
    const timer = window.setInterval(() => {
      dispatch(fetchNotifications(userId));
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [dispatch, isAuthenticated, user]);

  return null;
};

export default NotificationSync;
