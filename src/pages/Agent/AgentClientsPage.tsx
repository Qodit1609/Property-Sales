import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchAgentClientsAPI, type AgentClient } from "@/features/agent/agentAPI";

const AgentClientsPage: React.FC = () => {
  const { t } = useTranslation();
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
        const message = err instanceof Error ? err.message : t("agentPanel.clientsPage.failedLoad");
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadClients();
    return () => {
      mounted = false;
    };
  }, [t]);

  const buyers = useMemo(() => clients.filter((c) => c.type === "buyer"), [clients]);
  const sellers = useMemo(() => clients.filter((c) => c.type === "seller"), [clients]);

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
          {t("agentPanel.clientsPage.title")}
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {t("agentPanel.topBar.clients.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClientList title={t("agentPanel.clientsPage.buyerList")} items={buyers} loading={loading} error={error} />
        <ClientList title={t("agentPanel.clientsPage.sellerList")} items={sellers} loading={loading} error={error} />
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
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
      <div className="border-b border-[var(--b2)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--b1)]">{title}</h2>
      </div>
      <div className="p-4">
        {loading ? (
          <p className="text-sm text-[var(--muted)]">{t("agentPanel.clientsPage.loading")}</p>
        ) : error ? (
          <p className="text-sm text-[var(--error)]">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">{t("agentPanel.clientsPage.empty")}</p>
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

