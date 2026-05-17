import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../components/Modal/Modal";
import { Input, Button } from "@/components/common";
import { fetchAgentLeadsAPI, type AgentLead } from "@/features/agent/agentAPI";

type LeadStatus = "new" | "contacted" | "qualified" | "closed";

type Visit = {
  id: string;
  leadId: string;
  when: string;
  notes?: string;
};

const AgentLeadsPage: React.FC = () => {
  const { t } = useTranslation();
  const [leads, setLeads] = useState<AgentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [visits, setVisits] = useState<Visit[]>([]);
  const [scheduling, setScheduling] = useState<AgentLead | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadLeads = async () => {
      try {
        setLoading(true);
        setError("");
        const rows = await fetchAgentLeadsAPI();
        if (!mounted) return;
        setLeads(rows);
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : t("agentPanel.leadsPage.failedLoad");
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadLeads();
    return () => {
      mounted = false;
    };
  }, []);

  const activeCount = useMemo(
    () => leads.filter((l) => l.status !== "closed").length,
    [leads]
  );

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
            {t("agentPanel.leadsPage.title")}
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {t("agentPanel.leadsPage.activeCount", { count: activeCount })}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
        <table className="min-w-[860px] w-full text-sm">
          <thead className="bg-[var(--b2-soft)] text-[var(--b1)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">{t("agentPanel.leadsPage.table.lead")}</th>
              <th className="px-4 py-3 text-left font-semibold">{t("agentPanel.leadsPage.table.property")}</th>
              <th className="px-4 py-3 text-left font-semibold">{t("agentPanel.leadsPage.table.status")}</th>
              <th className="px-4 py-3 text-right font-semibold">{t("agentPanel.leadsPage.table.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--b2)]">
            {!loading && !error && leads.map((l) => (
              <tr key={l.id} className="hover:bg-[var(--b2-soft)]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--b1)]">{l.name}</p>
                  <p className="text-xs text-[var(--muted)]">{l.email}</p>
                </td>
                <td className="px-4 py-3">{l.property}</td>
                <td className="px-4 py-3">
                  <select
                    value={l.status}
                    onChange={(e) =>
                      setLeads((prev) =>
                        prev.map((x) =>
                          x.id === l.id
                            ? { ...x, status: e.target.value as LeadStatus }
                            : x
                        )
                      )
                    }
                    className="rounded-md border border-[var(--b2)] bg-[var(--white)] px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
                  >
                    <option value="new">{t("agentPanel.leadsPage.status.new")}</option>
                    <option value="contacted">{t("agentPanel.leadsPage.status.contacted")}</option>
                    <option value="qualified">{t("agentPanel.leadsPage.status.qualified")}</option>
                    <option value="closed">{t("agentPanel.leadsPage.status.closed")}</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    type="button"
                    onClick={() => setScheduling(l)}
                    className="inline-flex items-center rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-1 text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
                  >
                    {t("agentPanel.leadsPage.scheduleVisit")}
                  </Button>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-[var(--muted)]"
                >
                  {t("agentPanel.leadsPage.loading")}
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-[var(--error)]"
                >
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && leads.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-[var(--muted)]"
                >
                  {t("agentPanel.leadsPage.empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
        <div className="border-b border-[var(--b2)] px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--b1)]">
            {t("agentPanel.leadsPage.scheduledVisits")}
          </h2>
          <p className="text-[11px] text-[var(--muted)]">
            Visits scheduled from leads.
          </p>
        </div>
        <div className="p-4">
          {visits.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              No visits scheduled yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {visits.map((v) => (
                <li
                  key={v.id}
                  className="rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 px-3 py-2"
                >
                  <p className="text-sm font-medium text-[var(--b1)]">
                    {v.when}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    Lead: {v.leadId}
                  </p>
                  {v.notes && (
                    <p className="text-xs text-[var(--muted)]">{v.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal
        open={Boolean(scheduling)}
        onClose={() => setScheduling(null)}
        title={t("agentPanel.leadsPage.modal.scheduleTitle")}
      >
        {scheduling && (
          <ScheduleForm
            lead={scheduling}
            onCancel={() => setScheduling(null)}
            onCreate={(when, notes) => {
              setVisits((prev) => [
                ...prev,
                {
                  id: `V-${Date.now()}`,
                  leadId: scheduling.id,
                  when,
                  notes,
                },
              ]);
              setScheduling(null);
            }}
          />
        )}
      </Modal>
    </section>
  );
};

function ScheduleForm({
  lead,
  onCancel,
  onCreate,
}: {
  lead: AgentLead;
  onCancel: () => void;
  onCreate: (when: string, notes?: string) => void;
}) {
  const { t } = useTranslation();
  const [when, setWhen] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!when.trim()) return;
        onCreate(when, notes.trim() ? notes : undefined);
      }}
    >
      <div className="rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 px-3 py-2">
        <p className="text-xs font-semibold text-[var(--b1)]">
          Lead: {lead.name}
        </p>
        <p className="text-[11px] text-[var(--muted)]">{lead.property}</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="when">
          Date & time
        </label>
        <Input
          id="when"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          placeholder="e.g. 2026-03-20 11:30 AM"
          className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("agentPanel.leadsPage.modal.notesPlaceholder")}
          className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
          rows={3}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto rounded-md border border-[var(--b2)] px-4 py-2 text-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--b1)] transition"
        >
          Create visit
        </Button>
      </div>
    </form>
  );
}

export default AgentLeadsPage;

