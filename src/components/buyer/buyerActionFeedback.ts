export const BUYER_ACTION_FEEDBACK_EVENT = "buyer-action-feedback";

export function showBuyerActionFeedback(message: string): void {
  window.dispatchEvent(
    new CustomEvent(BUYER_ACTION_FEEDBACK_EVENT, { detail: message })
  );
}
