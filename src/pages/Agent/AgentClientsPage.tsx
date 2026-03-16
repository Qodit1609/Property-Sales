import React, { useMemo, useState } from "react";

type ClientType = "buyer" | "seller";

type Client = {
  id: string;
  name: string;
  email: string;
  type: ClientType;
};

const AgentClientsPage: React.FC = () => {
  const [clients] = useState<Client[]>([
    { id: "C-01", name: "Rahul Sharma", email: "rahul@example.com", type: "buyer" },
    { id: "C-02", name: "Priya Singh", email: "priya@example.com", type: "buyer" },
    { id: "C-03", name: "Seller One", email: "seller1@example.com", type: "seller" },
  ]);

  const buyers = useMemo(() => clients.filter((c) => c.type === "buyer"), [clients]);
  const sellers = useMemo(() => clients.filter((c) => c.type === "seller"), [clients]);

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
          Clients
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Buyer and seller contacts managed by the agent.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClientList title="Buyer list" items={buyers} />
        <ClientList title="Seller list" items={sellers} />
      </div>
    </section>
  );
};

function ClientList({ title, items }: { title: string; items: Client[] }) {
  return (
    <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
      <div className="border-b border-[var(--b2)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--b1)]">{title}</h2>
      </div>
      <div className="p-4">
        {items.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No clients found.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 px-3 py-2"
              >
                <p className="text-sm font-medium text-[var(--b1)]">{c.name}</p>
                <p className="text-xs text-[var(--muted)]">{c.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AgentClientsPage;

