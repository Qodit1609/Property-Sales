import React from "react";
import BuyerLayout from "../../components/buyer/BuyerLayout";
import { MessageCircle } from "lucide-react";

const BuyerEnquiriesPage: React.FC = () => {
  const mockEnquiries = [
    {
      id: "1",
      title: "4 Acre agriculture land near Indore Bypass",
      status: "Reply received",
      lastUpdate: "Seller shared price insights and layout",
    },
  ];

  return (
    <BuyerLayout>
      <div className="space-y-4 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--b1-mid)]">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--b1)]">
              Enquiries & contact requests
            </h2>
            <p className="text-[11px] text-[var(--muted)]">
              Structured view of your conversations with sellers and agents.
            </p>
          </div>
        </div>

        <div className="mt-2 space-y-2 text-xs text-[var(--b1)]">
          {mockEnquiries.map((item) => (
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
          ))}
        </div>
      </div>
    </BuyerLayout>
  );
};

export default BuyerEnquiriesPage;

