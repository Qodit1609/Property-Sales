import { useMemo, useState } from "react";
import type { ReactNode } from "react";

export type PropertyTab = {
  id: string;
  label: string;
  content: ReactNode;
};

type PropertyTabsProps = {
  tabs: PropertyTab[];
};

const PropertyTabs = ({ tabs }: PropertyTabsProps) => {
  const availableTabs = useMemo(() => tabs.filter((tab) => Boolean(tab.content)), [tabs]);
  const [activeTab, setActiveTab] = useState(availableTabs[0]?.id ?? "");

  if (!availableTabs.length) {
    return null;
  }

  const currentTab =
    availableTabs.find((tab) => tab.id === activeTab) ?? availableTabs[0];

  return (
    <section className="rounded-2xl border border-[var(--b2-soft)] bg-white p-4 sm:p-6">
      <div className="sticky top-20 z-20 -mx-4 overflow-x-auto border-b border-[var(--b2-soft)] bg-white px-4 pb-3 sm:-mx-6 sm:px-6">
        <div className="flex min-w-max items-center gap-2">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                currentTab.id === tab.id
                  ? "bg-[var(--b1)] text-[var(--fg)]"
                  : "bg-[var(--b2-soft)]/60 text-[var(--b1)] hover:bg-[var(--b2-soft)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="pt-4 sm:pt-5">{currentTab.content}</div>
    </section>
  );
};

export default PropertyTabs;
