import React, { useEffect, useMemo, useState } from "react";
import { fetchAgentClientsAPI, type AgentClient } from "@/features/agent/agentAPI";

const AgentClientsPage: React.FC = () => {
  const [clients, setClients] = useState<AgentClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadClients = async () => {
      try {
        setLoading(true);
        setError("");
        const rows = await fetchAgentClientsAPI();
        if (!mounted) return;
        setClients(rows);
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : "Failed to load clients.";
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadClients();
    return () => {
      mounted = false;
    };
  }, []);

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
        <ClientList title="Buyer list" items={buyers} loading={loading} error={error} />
        <ClientList title="Seller list" items={sellers} loading={loading} error={error} />
      </div>
    </section>
  );
};

function ClientList({
  title,
  items,
  loading,
  error,
}: {
  title: string;
  items: AgentClient[];
  loading: boolean;
  error: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
      <div className="border-b border-[var(--b2)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--b1)]">{title}</h2>
      </div>
      <div className="p-4">
        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading clients...</p>
        ) : error ? (
          <p className="text-sm text-[var(--error)]">{error}</p>
        ) : items.length === 0 ? (
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

