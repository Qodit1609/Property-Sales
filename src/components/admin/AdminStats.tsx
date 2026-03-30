import React from "react";
import { Home, ListChecks, Users, ShieldCheck } from "lucide-react";

import type { Property } from "../../features/properties/propertyType";
import type { ManagedAccount } from "../../features/auth/roleTypes";

interface AdminStatsProps {
  accounts: ManagedAccount[];
  listings: Property[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ accounts, listings }) => {
  const totalAccounts = accounts.length;
  const buyers = accounts.filter((u) => u.role === "buyer").length;
  const sellers = accounts.filter((u) => u.role === "seller").length;
  const agents = accounts.filter((u) => u.role === "agent").length;

  const totalListings = listings.length;
  const approvedListings = listings.filter((l) => l.status === "approved")
    .length;
  const pendingListings = listings.filter((l) => l.status === "pending").length;
  const rejectedListings = listings.filter((l) => l.status === "rejected")
    .length;

  const cards = [
    {
      label: "Total properties",
      value: totalListings,
      icon: Home,
      tone: "emerald",
    },
    {
      label: "Approved",
      value: approvedListings,
      icon: ShieldCheck,
      tone: "sky",
    },
    {
      label: "Pending",
      value: pendingListings,
      icon: ListChecks,
      tone: "amber",
    },
    {
      label: "Rejected",
      value: rejectedListings,
      icon: ListChecks,
      tone: "rose",
    },
    {
      label: "Total accounts",
      value: totalAccounts,
      icon: Users,
      tone: "slate",
    },
    {
      label: "Buyers",
      value: buyers,
      icon: Users,
      tone: "emerald",
    },
    {
      label: "Sellers",
      value: sellers,
      icon: Users,
      tone: "sky",
    },
    {
      label: "Agents",
      value: agents,
      icon: Users,
      tone: "amber",
    },
  ];

  const toneClasses: Record<
    string,
    { bg: string; ring: string; text: string; icon: string }
  > = {
    emerald: {
      bg: "from-emerald-500/20 to-emerald-400/5",
      ring: "ring-emerald-500/40",
      text: "text-emerald-100",
      icon: "text-emerald-300",
    },
    sky: {
      bg: "from-sky-500/20 to-sky-400/5",
      ring: "ring-sky-500/40",
      text: "text-sky-100",
      icon: "text-sky-300",
    },
    amber: {
      bg: "from-amber-500/20 to-amber-400/5",
      ring: "ring-amber-500/40",
      text: "text-amber-100",
      icon: "text-amber-300",
    },
    rose: {
      bg: "from-rose-500/20 to-rose-400/5",
      ring: "ring-rose-500/40",
      text: "text-rose-100",
      icon: "text-rose-300",
    },
    slate: {
      bg: "from-slate-500/25 to-slate-800/60",
      ring: "ring-slate-500/40",
      text: "text-slate-100",
      icon: "text-slate-300",
    },
  };

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const tone = toneClasses[card.tone];

        return (
          <div
            key={card.label}
            className={[
              "relative overflow-hidden rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow",
              tone.bg,
              "ring-1",
              tone.ring,
            ].join(" ")}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--white)] ${tone.icon}`}
            >
              <Icon className="h-4 w-4" />
            </div>

            <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-[var(--b1-mid)]">
              {card.label}
            </p>

            <p className={`mt-1 text-xl font-semibold ${tone.text}`}>
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;
