import React, { useMemo, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { Input, Button } from "@/components/common";

type VisitStatus = "scheduled" | "rescheduled" | "cancelled";

type Visit = {
  id: string;
  clientName: string;
  property: string;
  when: string;
  status: VisitStatus;
};

const AgentVisitsPage: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([
    {
      id: "V-2001",
      clientName: "Rahul Sharma",
      property: "Farmhouse - Goa",
      when: "2026-03-20 11:30 AM",
      status: "scheduled",
    },
  ]);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Visit | null>(null);
  const [cancelling, setCancelling] = useState<Visit | null>(null);

  const active = useMemo(
    () => visits.filter((v) => v.status !== "cancelled").length,
    [visits]
  );

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
            Visit Scheduling
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {active} active visits
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setCreating(true)}
          className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] shadow hover:bg-[var(--b1)] transition"
        >
          Create visit
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
        <table className="min-w-[860px] w-full text-sm">
          <thead className="bg-[var(--b2-soft)] text-[var(--b1)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Client</th>
              <th className="px-4 py-3 text-left font-semibold">Property</th>
              <th className="px-4 py-3 text-left font-semibold">When</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--b2)]">
            {visits.map((v) => (
              <tr key={v.id} className="hover:bg-[var(--b2-soft)]">
                <td className="px-4 py-3 font-medium text-[var(--b1)]">
                  {v.clientName}
                </td>
                <td className="px-4 py-3">{v.property}</td>
                <td className="px-4 py-3">{v.when}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-[var(--b2-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--b1)] ring-1 ring-[var(--b2)]">
                    {v.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => setEditing(v)}
                      className="inline-flex items-center rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-1 text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
                    >
                      Reschedule
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCancelling(v)}
                      className="inline-flex items-center rounded-md border border-[var(--error)] bg-[var(--error-bg)] px-3 py-1 text-xs font-medium text-[var(--error)] hover:opacity-80 transition"
                    >
                      Cancel
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {visits.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-[var(--muted)]"
                >
                  No visits created.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Create Visit">
        <VisitForm
          submitLabel="Create"
          onCancel={() => setCreating(false)}
          onSubmit={(payload) => {
            setVisits((prev) => [
              ...prev,
              { id: `V-${Date.now()}`, status: "scheduled", ...payload },
            ]);
            setCreating(false);
          }}
        />
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Reschedule Visit"
      >
        {editing && (
          <VisitForm
            submitLabel="Save"
            initial={{
              clientName: editing.clientName,
              property: editing.property,
              when: editing.when,
            }}
            onCancel={() => setEditing(null)}
            onSubmit={(payload) => {
              setVisits((prev) =>
                prev.map((x) =>
                  x.id === editing.id
                    ? { ...x, ...payload, status: "rescheduled" }
                    : x
                )
              );
              setEditing(null);
            }}
          />
        )}
      </Modal>

      <Modal
        open={Boolean(cancelling)}
        onClose={() => setCancelling(null)}
        title="Cancel Visit"
      >
        {cancelling && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--b1)]">
              Cancel visit for{" "}
              <span className="font-semibold">{cancelling.clientName}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setCancelling(null)}
                className="rounded-md border border-[var(--b2)] bg-[var(--white)] px-4 py-2 text-sm"
              >
                Keep
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setVisits((prev) =>
                    prev.map((x) =>
                      x.id === cancelling.id ? { ...x, status: "cancelled" } : x
                    )
                  );
                  setCancelling(null);
                }}
                className="rounded-md border border-[var(--error)] bg-[var(--error-bg)] px-4 py-2 text-sm font-semibold text-[var(--error)] hover:opacity-80 transition"
              >
                Cancel visit
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

function VisitForm({
  initial,
  submitLabel,
  onCancel,
  onSubmit,
}: {
  initial?: { clientName: string; property: string; when: string };
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (payload: { clientName: string; property: string; when: string }) => void;
}) {
  const [clientName, setClientName] = useState(initial?.clientName ?? "");
  const [property, setProperty] = useState(initial?.property ?? "");
  const [when, setWhen] = useState(initial?.when ?? "");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ clientName, property, when });
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="clientName">
            Client name
          </label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="when">
            Date & time
          </label>
          <Input
            id="when"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            placeholder="e.g. 2026-03-20 11:30 AM"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="property">
          Property
        </label>
        <Input
          id="property"
          value={property}
          onChange={(e) => setProperty(e.target.value)}
          className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
          placeholder="Farmhouse - Goa"
          required
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
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default AgentVisitsPage;

