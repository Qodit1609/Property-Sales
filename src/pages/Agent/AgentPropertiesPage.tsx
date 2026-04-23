import React, { useMemo, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useAppSelector } from "../../hooks/reduxHooks";
import { Input, Button } from "@/components/common";

type LocalStatus = "active" | "inactive" | "sold";

type AgentPropertyRow = {
  id: string;
  title: string;
  address: string;
  price: number;
  status: LocalStatus;
};

const AgentPropertiesPage: React.FC = () => {
  const { data } = useAppSelector((state) => state.properties);

  const initialRows = useMemo<AgentPropertyRow[]>(() => {
    return data.slice(0, 12).map((p) => ({
      id: p._id,
      title: p.title,
      address: p.address,
      price: p.price,
      status: "active",
    }));
  }, [data]);

  const [rows, setRows] = useState<AgentPropertyRow[]>(initialRows);
  const [editing, setEditing] = useState<AgentPropertyRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AgentPropertyRow | null>(
    null
  );

  const onEdit = (row: AgentPropertyRow) => setEditing(row);
  const onDelete = (row: AgentPropertyRow) => setConfirmDelete(row);

  const saveEdit = (next: AgentPropertyRow) => {
    setRows((prev) => prev.map((r) => (r.id === next.id ? next : r)));
    setEditing(null);
  };

  const applyDelete = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setConfirmDelete(null);
  };

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
            My Properties
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Manage your assigned inventory.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-[var(--b2-soft)] text-[var(--b1)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Property</th>
              <th className="px-4 py-3 text-left font-semibold">Price</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--b2)]">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--b2-soft)]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--b1)]">
                    {r.title || "Untitled"}
                  </p>
                  <p className="text-xs text-[var(--muted)] line-clamp-1">
                    {r.address}
                  </p>
                </td>
                <td className="px-4 py-3">
                  ₹ {r.price?.toLocaleString("en-IN") ?? "N/A"}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((x) =>
                          x.id === r.id
                            ? { ...x, status: e.target.value as LocalStatus }
                            : x
                        )
                      )
                    }
                    className="rounded-md border border-[var(--b2)] bg-[var(--white)] px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="sold">Sold</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => onEdit(r)}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-1 text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onDelete(r)}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--error)] bg-[var(--error-bg)] px-3 py-1 text-xs font-medium text-[var(--error)] hover:opacity-80 transition"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-[var(--muted)]"
                >
                  No properties assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit Property"
      >
        {editing && (
          <EditForm
            value={editing}
            onCancel={() => setEditing(null)}
            onSave={saveEdit}
          />
        )}
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete Property"
      >
        {confirmDelete && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--b1)]">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{confirmDelete.title}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-md border border-[var(--b2)] bg-[var(--white)] px-4 py-2 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => applyDelete(confirmDelete.id)}
                className="rounded-md border border-[var(--error)] bg-[var(--error-bg)] px-4 py-2 text-sm font-semibold text-[var(--error)] hover:opacity-80 transition"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

function EditForm({
  value,
  onCancel,
  onSave,
}: {
  value: AgentPropertyRow;
  onCancel: () => void;
  onSave: (next: AgentPropertyRow) => void;
}) {
  const [title, setTitle] = useState(value.title);
  const [address, setAddress] = useState(value.address);
  const [price, setPrice] = useState(String(value.price ?? ""));

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...value,
          title,
          address,
          price: price.trim() ? Number(price) : 0,
        });
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)]"
          required
        />
        <Input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          inputMode="numeric"
          className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)]"
          required
        />
      </div>
      <Input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
        className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)]"
      />

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
          Save
        </Button>
      </div>
    </form>
  );
}

export default AgentPropertiesPage;

