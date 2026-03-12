import type { ToastMessage } from "./Toast";

export type PostPropertyOutletContext = {
  pushToast: (t: Omit<ToastMessage, "id">) => void;
};

