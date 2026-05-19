import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../components/Modal/Modal";
import { translateStatus } from "@/lib/i18nHelpers";
import { Input, Button } from "@/components/common";
import {
  createAgentVisitAPI,
  deleteAgentVisitAPI,
  fetchAgentClientsAPI,
  fetchAgentVisitsAPI,
  updateAgentVisitAPI,
  type AgentClient,
  type AgentVisit,
  type AgentVisitStatus,
} from "@/features/agent/agentAPI";
import { formatDateTime } from "@/utils/propertyFormatters";

const toDateTimeLocalValue = (value?: string): string => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hour = String(parsed.getHours()).padStart(2, "0");
  const minute = String(parsed.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const AgentVisitsPage: React.FC = () => {
  const { t } = useTranslation();
  const [visits, setVisits] = useState<AgentVisit[]>([]);
  const [clients, setClients] = useState<AgentClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [editing, setEditing] = useState<AgentVisit | null>(null);
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState<AgentVisit | null>(null);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  const loadVisits = async () => {
    const visitRows = await fetchAgentVisitsAPI();
    setVisits(visitRows);
  };

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        const [visitRows, clientRows] = await Promise.all([
          fetchAgentVisitsAPI(),
          fetchAgentClientsAPI(),
        ]);
        if (!mounted) return;
        setVisits(visitRows);
        setClients(clientRows);
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : t("agentPanel.visitsPage.failedLoad");
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const active = useMemo(
    () => visits.filter((v) => v.status !== "cancelled").length,
    [visits]
  );

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
            {t("agentPanel.visitsPage.title")}
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {t("agentPanel.visitsPage.activeCount", { count: active })}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setCreating(true)}
          className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] shadow hover:bg-[var(--b1)] transition"
        >
          {t("agentPanel.visitsPage.createVisit")}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
        <table className="min-w-[860px] w-full text-sm">
          <thead className="bg-[var(--b2-soft)] text-[var(--b1)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">
                {t("agentPanel.visitsPage.table.client")}
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                {t("agentPanel.visitsPage.table.property")}
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                {t("agentPanel.visitsPage.table.when")}
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                {t("agentPanel.visitsPage.table.status")}
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                {t("agentPanel.visitsPage.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--b2)]">
            {!loading && !error && visits.map((v) => (
              <tr key={v.id} className="hover:bg-[var(--b2-soft)]">
                <td className="px-4 py-3 font-medium text-[var(--b1)]">
                  {v.clientName}
                </td>
                <td className="px-4 py-3">{v.property}</td>
                <td className="px-4 py-3">{formatDateTime(v.when)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-[var(--b2-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--b1)] ring-1 ring-[var(--b2)]">
                    {translateStatus(v.status) ||
                      t(`agentPanel.visitsPage.status.${v.status}`, { defaultValue: v.status })}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => setEditing(v)}
                      className="inline-flex items-center rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-1 text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
                    >
                      {t("agentPanel.visitsPage.reschedule")}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCancelling(v)}
                      className="inline-flex items-center rounded-md border border-[var(--error)] bg-[var(--error-bg)] px-3 py-1 text-xs font-medium text-[var(--error)] hover:opacity-80 transition"
                    >
                      {t("agentPanel.visitsPage.cancel")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-[var(--muted)]"
                >
                  {t("agentPanel.visitsPage.loading")}
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-[var(--error)]"
                >
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && visits.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-[var(--muted)]"
                >
                  {t("agentPanel.visitsPage.empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title={t("agentPanel.visitsPage.createModalTitle")}
      >
        <VisitForm
          clients={clients}
          submitLabel={t("agentPanel.visitsPage.createVisit")}
          onCancel={() => setCreating(false)}
          onSubmit={async (payload) => {
            try {
              setCreateSubmitting(true);
              setError("");
              await createAgentVisitAPI({
                clientId: payload.clientId,
                clientName: payload.clientName,
                type: payload.property,
                date: payload.when,
                notes: payload.notes,
                status: "scheduled",
              });
              await loadVisits();
              setCreating(false);
            } catch (err) {
              const message =
                err instanceof Error ? err.message : t("agentPanel.visitsPage.failedCreate");
              setError(message);
            } finally {
              setCreateSubmitting(false);
            }
          }}
          submitting={createSubmitting}
        />
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={t("agentPanel.visitsPage.rescheduleModalTitle")}
      >
        {editing && (
          <VisitForm
            clients={clients}
            submitLabel={t("common.save")}
            initial={{
              clientId: editing.clientId,
              clientName: editing.clientName,
              property: editing.property,
              when: editing.when,
            }}
            onCancel={() => setEditing(null)}
            onSubmit={async (payload) => {
              try {
                setRescheduleSubmitting(true);
                setError("");
                const updated = await updateAgentVisitAPI(editing.id, {
                  clientName: payload.clientName,
                  type: payload.property,
                  date: payload.when,
                  status: "rescheduled",
                });
                setVisits((prev) => prev.map((x) => (x.id === editing.id ? updated : x)));
                setEditing(null);
              } catch (err) {
                const message =
                  err instanceof Error ? err.message : t("agentPanel.visitsPage.failedReschedule");
                setError(message);
              } finally {
                setRescheduleSubmitting(false);
              }
            }}
            submitting={rescheduleSubmitting}
          />
        )}
      </Modal>

      <Modal
        open={Boolean(cancelling)}
        onClose={() => setCancelling(null)}
        title={t("agentPanel.visitsPage.cancelModalTitle")}
      >
        {cancelling && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--b1)]">
              {t("agentPanel.visitsPage.cancelConfirm", { name: cancelling.clientName })}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setCancelling(null)}
                className="rounded-md border border-[var(--b2)] bg-[var(--white)] px-4 py-2 text-sm text-[var(--b1)] hover:bg-[var(--bg)]"
              >
                {t("agentPanel.visitsPage.keep")}
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  try {
                    setCancelSubmitting(true);
                    setError("");
                    await deleteAgentVisitAPI(cancelling.id);
                    setVisits((prev) => prev.filter((x) => x.id !== cancelling.id));
                    setCancelling(null);
                  } catch (err) {
                    const message =
                      err instanceof Error ? err.message : t("agentPanel.visitsPage.failedCancel");
                    setError(message);
                  } finally {
                    setCancelSubmitting(false);
                  }
                }}
                disabled={cancelSubmitting}
                className="rounded-md border border-[var(--error)] bg-[var(--error-bg)] px-4 py-2 text-sm font-semibold text-[var(--error)] hover:opacity-80 transition"
              >
                {cancelSubmitting
                  ? t("agentPanel.visitsPage.cancelling")
                  : t("agentPanel.visitsPage.cancelVisit")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

function VisitForm({
  clients,
  initial,
  submitLabel,
  submitting,
  onCancel,
  onSubmit,
}: {
  clients: AgentClient[];
  initial?: { clientId?: string; clientName: string; property: string; when: string };
  submitLabel: string;
  submitting?: boolean;
  onCancel: () => void;
  onSubmit: (payload: {
    clientId?: string;
    clientName: string;
    property: string;
    when: string;
    notes?: string;
    status?: AgentVisitStatus;
  }) => void;
}) {
  const { t } = useTranslation();
  const [clientId] = useState(initial?.clientId ?? "");
  const [clientName, setClientName] = useState(initial?.clientName ?? "");
  const [property, setProperty] = useState(initial?.property ?? "");
  const [when, setWhen] = useState(toDateTimeLocalValue(initial?.when));

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const selectedClient = clients.find((client) => client.id === clientId);
        const fallbackClient = clients.find((client) => client.name === clientName);
        onSubmit({
          clientId: selectedClient?.id || fallbackClient?.id || undefined,
          clientName: selectedClient?.name || clientName,
          property,
          when,
        });
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="clientName">
            {t("agentPanel.visitsPage.clientName")}
          </label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            placeholder={t("agentPanel.visitsPage.clientNamePlaceholder")}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="when">
            {t("agentPanel.visitsPage.dateTime")}
          </label>
          <Input
            id="when"
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="property">
          {t("agentPanel.visitsPage.table.property")}
        </label>
        <Input
          id="property"
          value={property}
          onChange={(e) => setProperty(e.target.value)}
          className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
          placeholder={t("agentPanel.visitsPage.propertyPlaceholder")}
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="w-full sm:w-auto rounded-md border border-[var(--b2)] px-4 py-2 text-sm"
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--b1)] transition"
        >
          {submitting ? t("agentPanel.profilePage.saving") : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default AgentVisitsPage;

