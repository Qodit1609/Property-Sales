import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import BuyerLayout from "../../components/buyer/BuyerLayout";
import { MessageCircle } from "lucide-react";
import { useAppSelector } from "../../hooks/reduxHooks";

type EnquiryRow = {
  id: string;
  title: string;
  status: string;
  lastUpdate: string;
};

const BuyerEnquiriesPage: React.FC = () => {
  const { t } = useTranslation();
  const activity = useAppSelector((state) => state.buyer.activity);
  const notifications = useAppSelector((state) => state.buyer.notifications);

  const enquiries = useMemo<EnquiryRow[]>(() => {
    const activityRows = activity
      .filter((item) => item.type === "enquiry" || item.type === "callback" || item.type === "visit")
      .map((item) => ({
        id: item.id,
        title: item.title || t("buyerPanel.enquiries.propertyEnquiry"),
        status:
          item.type === "visit"
            ? t("buyerPanel.enquiries.visitScheduled")
            : item.type === "callback"
              ? t("buyerPanel.enquiries.callbackRequested")
              : t("buyerPanel.enquiries.enquirySent"),
        lastUpdate: t("buyerPanel.enquiries.updatedOn", {
          date: new Date(item.timestamp).toLocaleString(),
        }),
      }));

    const replyRows = notifications
      .filter((item) => item.type === "seller_reply")
      .map((item) => ({
        id: item.id,
        title: item.title || t("buyerPanel.enquiries.sellerResponse"),
        status: item.read ? t("buyerPanel.enquiries.replyRead") : t("buyerPanel.enquiries.replyReceived"),
        lastUpdate: item.message,
      }));

    return [...replyRows, ...activityRows];
  }, [activity, notifications, t]);

  return (
    <BuyerLayout>
      <div className="space-y-4 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--b1-mid)]">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--b1)]">
              {t("buyerPanel.enquiries.pageHeading")}
            </h2>
            <p className="text-[11px] text-[var(--muted)]">
              {t("buyerPanel.enquiries.pageSubtitle")}
            </p>
          </div>
        </div>

        <div className="mt-2 space-y-2 text-xs text-[var(--b1)]">
          {enquiries.length > 0 ? (
            enquiries.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-[var(--b2-soft)] bg-[var(--b2-soft)] px-3 py-2"
              >
                <div>
                  <p className="text-[11px] font-semibold text-[var(--b1)]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                    {item.lastUpdate}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--b2-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--b1-mid)]">
                  {item.status}
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)]/40 px-3 py-4 text-[11px] text-[var(--muted)]">
              {t("buyerPanel.enquiries.empty")}
            </div>
          )}
        </div>
      </div>
    </BuyerLayout>
  );
};

export default BuyerEnquiriesPage;

