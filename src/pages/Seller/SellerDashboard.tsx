import React, { useEffect, useState } from "react";
import { ListChecks, Pencil, Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import type { RootState } from "../../app/store";
import DashboardLayout from "../../layout/DashboardLayout";
import {
  createListing,
  deleteListing,
  fetchMyListings,
  updateListing,
} from "../../features/seller/sellerSlice";
import Modal from "../../components/Modal/Modal";
import type { Property } from "../../features/properties/propertyType";
import type { SellerListingPayload } from "../../features/seller/sellerAPI";

type FormState = SellerListingPayload;

const emptyForm: FormState = {
  title: "",
  address: "",
  price: 0,
  images: [""],
  propertyType: "Farmhouse",
  size: undefined,
  beds: undefined,
  baths: undefined,
  parking: undefined,
};

const SellerDashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  const { listings, loading, error, actionLoading } = useAppSelector(
    (state: RootState) => state.seller
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Property | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingListing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (listing: Property) => {
    setEditingListing(listing);
    setForm({
      title: listing.title,
      address: listing.address,
      price: listing.price,
      images: listing.images ?? [""],
      propertyType: listing.propertyType,
      size: listing.size,
      beds: listing.beds,
      baths: listing.baths,
      parking: listing.parking,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "price" || name === "size") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : Number(value),
      }));
      return;
    }

    if (name === "beds" || name === "baths" || name === "parking") {
      setForm((prev) => ({ ...prev, [name]: value }));
      return;
    }

    if (name === "image0") {
      setForm((prev) => ({ ...prev, images: [value] }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (editingListing) {
      await dispatch(
        updateListing({
          id: editingListing._id,
          payload: form,
        })
      );
    } else {
      await dispatch(createListing(form));
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteListing(id));
  };

  const sidebar = (
    <ul className="space-y-2">
      <li>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[var(--b2-soft)] text-[var(--b1)] hover:bg-[var(--b2)] transition"
          onClick={openCreateModal}
        >
          <Plus size={16} />
          New Listing
        </button>
      </li>
      <li>
        <div className="mt-4 text-xs font-semibold text-[var(--b1)] uppercase px-2">
          My Listings
        </div>
      </li>
    </ul>
  );

  return (
    <>
      <DashboardLayout title="Seller Panel" sidebar={sidebar}>
        <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)] flex items-center gap-2">
              <ListChecks size={20} />
              My Listings
            </h1>

            <button
              type="button"
              onClick={openCreateModal}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-lg bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] shadow hover:bg-[var(--b1)] transition"
            >
              <Plus size={16} />
              Add Listing
            </button>
          </div>

          {loading && (
            <p className="text-sm text-[var(--muted)]">
              Loading your listings...
            </p>
          )}

          {error && (
            <p className="text-sm text-[var(--error)]">
              {error}
            </p>
          )}

          <div className="overflow-x-auto rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-[var(--b2-soft)] text-[var(--b1)]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Property</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Price</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--b2)]">
                {(listings as Property[]).map((listing) => (
                  <tr key={listing._id} className="hover:bg-[var(--b2-soft)]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--b1)]">
                        {listing.title || "Untitled"}
                      </p>
                      <p className="text-xs text-[var(--muted)] line-clamp-1">
                        {listing.address}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      {listing.propertyType}
                    </td>

                    <td className="px-4 py-3">
                      ₹ {listing.price?.toLocaleString("en-IN") ?? "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          listing.status === "approved"
                            ? "bg-[var(--success-bg)] text-[var(--success)]"
                            : listing.status === "rejected"
                            ? "bg-[var(--error-bg)] text-[var(--error)]"
                            : "bg-[var(--warning-bg)] text-[var(--warning)]"
                        }`}
                      >
                        {listing.status ?? "pending"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          disabled={actionLoading}
                          onClick={() => openEditModal(listing)}
                          className="inline-flex items-center gap-1 rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-1 text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          disabled={actionLoading}
                          onClick={() => handleDelete(listing._id)}
                          className="inline-flex items-center gap-1 rounded-md border border-[var(--error)] bg-[var(--error-bg)] px-3 py-1 text-xs font-medium text-[var(--error)] hover:opacity-80 transition"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {listings.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-sm text-[var(--muted)]"
                    >
                      You have no listings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </DashboardLayout>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingListing ? "Edit Listing" : "Add New Listing"}
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)]"
              required
            />

            <select
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)]"
            >
              <option value="Farmhouse">Farmhouse</option>
              <option value="Agriculture Land">Agriculture Land</option>
              <option value="Resort">Resort</option>
              <option value="Rent Farmhouse">Rent Farmhouse</option>
            </select>
          </div>

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)]"
            required
          />

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="w-full sm:w-auto rounded-md border border-[var(--b2)] px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full sm:w-auto rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--b1)] disabled:opacity-70"
            >
              {actionLoading
                ? "Saving..."
                : editingListing
                ? "Update Listing"
                : "Create Listing"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SellerDashboard;