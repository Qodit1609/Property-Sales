import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  saveDraftNow,
  submitPostProperty,
} from "../../features/postProperty/postPropertySlice";
import {
  validateBasicDetails,
  validateLocationDetails,
  validateMedia,
  validateProfileDetails,
} from "../../features/postProperty/postPropertyValidation";
import FormActions from "./FormActions";
import type { PostPropertyOutletContext } from "./postPropertyOutletContext";
import { Button } from "@/components/common";
import { FileText } from "lucide-react";

function SummaryRow({
  label,
  value,
  singleLine = false,
}: {
  label: string;
  value: string;
  singleLine?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="shrink-0 text-xs font-semibold text-[var(--muted)]">{label}</span>
      <span
        className={`min-w-0 flex-1 text-sm font-medium text-[var(--b1)] text-right ${
          singleLine ? "truncate whitespace-nowrap" : "break-words"
        }`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function formatVideoPreview(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 60) return trimmed;
  return `${trimmed.slice(0, 35)}...${trimmed.slice(-20)}`;
}

function isImageDocument(mimeType?: string, fileName?: string): boolean {
  if (mimeType?.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp)$/i.test(fileName ?? "");
}

export default function ReviewSubmit() {
  const { pushToast } = useOutletContext<PostPropertyOutletContext>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const post = useAppSelector((s) => s.postProperty);
  const isEditMode = Boolean(post.editPropertyId);

  const allErrors = useMemo(() => {
    const basic = validateBasicDetails(post.basicDetails);
    const locationBase = validateLocationDetails(post.locationDetails);
    const location = {
      ...locationBase,
      ...(post.basicDetails.category === "Agriculture Land" &&
      !post.locationDetails.surveyNumber.trim()
        ? { surveyNumber: "Survey number is required for agriculture land" }
        : {}),
    };
    const profile = validateProfileDetails(post.profileDetails, post.basicDetails);
    const media = validateMedia(post.media);
    return { basic, location, profile, media };
  }, [post.basicDetails, post.locationDetails, post.media, post.profileDetails]);

  const isReadyToSubmit =
    Object.keys(allErrors.basic).length === 0 &&
    Object.keys(allErrors.location).length === 0 &&
    Object.keys(allErrors.profile).length === 0 &&
    Object.keys(allErrors.media).length === 0;

  const submit = async () => {
    if (!isReadyToSubmit) {
      pushToast({
        kind: "error",
        title: "Review required",
        detail: "Some steps are incomplete. Use Edit to fix them before submitting.",
      });
      return;
    }

    const result = await dispatch(submitPostProperty());
    if (submitPostProperty.fulfilled.match(result)) {
      pushToast({ kind: "success", title: isEditMode ? "Property updated" : "Property submitted" });
      if (isEditMode) {
        window.alert("Update Property successfully.");
      } else {
        window.alert("Property is successfully Listed.");
      }
      const created = result.payload as unknown as { _id?: string };
      if (created?._id) {
        navigate(`/admin/properties`, { replace: true });
      } else {
        navigate(isEditMode ? "/admin/properties" : "/", { replace: true });
      }
    } else {
      pushToast({
        kind: "error",
        title: "Submission failed",
        detail: result.payload ? String(result.payload) : post.submitError ?? "Please try again.",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--b1)]">
            Step 6: Review & Submit
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Confirm details before publishing your listing.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            dispatch(saveDraftNow());
            pushToast({ kind: "success", title: "Draft saved" });
          }}
          className="rounded-md border border-[var(--b2)] px-4 py-2 text-sm font-semibold hover:bg-[var(--b1-mid)] transition"
        >
          Save draft
        </Button>
      </div>

      {!isReadyToSubmit && (
        <div className="mt-5 rounded-xl border border-[var(--warning)] bg-[var(--warning-bg)] px-4 py-3">
          <p className="text-sm font-semibold text-[var(--warning)]">
            Some steps need attention before submit.
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Use the Edit buttons below to complete missing details.
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--b1)]">Basic details</p>
            <Button
              type="button"
              onClick={() => navigate("/post-property/basic")}
              className="text-xs font-semibold hover:bg-[var(--b1-mid)]"
            >
              Edit
            </Button>
          </div>
          <div className="mt-3 divide-y divide-[var(--b2)]">
            <SummaryRow label="Listing type" value={post.basicDetails.listingType} />
            <SummaryRow label="Category" value={post.basicDetails.category} />
            <SummaryRow label="Property type" value={post.basicDetails.propertyType} />
            <SummaryRow label="Title" value={post.basicDetails.title} />
            <SummaryRow label="Contact" value={`${post.basicDetails.contactName} • ${post.basicDetails.contactMobile}`} />
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--b1)]">Location</p>
            <Button
              type="button"
              onClick={() => navigate("/post-property/location")}
              className="text-xs font-semibold hover:bg-[var(--b1-mid)]"
            >
              Edit
            </Button>
          </div>
          <div className="mt-3 divide-y divide-[var(--b2)]">
            <SummaryRow label="State" value={post.locationDetails.state} />
            <SummaryRow label="City" value={post.locationDetails.city} />
            <SummaryRow label="Tehsil" value={post.locationDetails.tehsil} />
            <SummaryRow label="Village" value={post.locationDetails.village} />
            <SummaryRow label="Locality" value={post.locationDetails.locality} />
            <SummaryRow label="Survey no." value={post.locationDetails.surveyNumber} />
            <SummaryRow label="Pin code" value={post.locationDetails.pinCode} />
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--b1)]">Profile</p>
            <Button
              type="button"
              onClick={() => navigate("/post-property/profile")}
              className="text-xs font-semibold hover:bg-[var(--b1-mid)]"
            >
              Edit
            </Button>
          </div>
          <div className="mt-3 divide-y divide-[var(--b2)]">
            <SummaryRow
              label="Area"
              value={
                post.profileDetails.totalArea != null
                  ? `${post.profileDetails.totalArea} ${post.profileDetails.areaUnit}`
                  : ""
              }
            />
            <SummaryRow
              label="Price"
              value={
                post.profileDetails.price != null
                  ? `₹ ${post.profileDetails.price.toLocaleString("en-IN")}${
                      post.profileDetails.negotiable ? " (Negotiable)" : ""
                    }`
                  : ""
              }
            />
            <SummaryRow label="Ownership" value={post.profileDetails.ownershipType} />
            <SummaryRow label="Soil" value={post.profileDetails.soilType} />
            <SummaryRow
              label="Suitable for"
              value={post.profileDetails.suitableFor.join(", ")}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--b1)]">Media & amenities</p>
            <Button
              type="button"
              onClick={() => navigate("/post-property/media")}
              className="text-xs font-semibold"
            >
              Edit
            </Button>
          </div>
          <div className="mt-3 divide-y divide-[var(--b2)]">
            <SummaryRow label="Images" value={`${post.media.images.length}`} />
            {post.media.images.length > 0 && (
              <div className="py-3">
                <p className="text-xs font-semibold text-[var(--muted)]">Image preview</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {post.media.images.map((image) => (
                    <div
                      key={image.id}
                      className="overflow-hidden rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40"
                    >
                      <div className="aspect-[4/3] w-full">
                        <img
                          src={image.url}
                          alt={image.fileName || "Property image"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <SummaryRow label="Documents" value={`${post.media.documents.length}`} />
            {post.media.documents.length > 0 && (
              <div className="py-3">
                <p className="text-xs font-semibold text-[var(--muted)]">Documents preview</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {post.media.documents.map((doc) => {
                    const showImage = isImageDocument(doc.mimeType, doc.fileName);
                    return (
                      <div
                        key={doc.id}
                        className="overflow-hidden rounded-xl border border-[var(--b2)] bg-[var(--white)]"
                      >
                        <div className="aspect-[4/3] w-full bg-[var(--b2-soft)]/50">
                          {showImage ? (
                            <img
                              src={doc.url}
                              alt={doc.fileName || "Document"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[var(--muted)]">
                              <FileText className="h-8 w-8" strokeWidth={1.75} aria-hidden />
                            </div>
                          )}
                        </div>
                        <p className="truncate border-t border-[var(--b2)] px-2 py-1.5 text-[10px] text-[var(--muted)]">
                          {doc.fileName || "Document"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <SummaryRow
              label="Video"
              value={formatVideoPreview(post.media.videoUrl ?? "")}
              singleLine
            />
            <SummaryRow
              label="Amenities selected"
              value={Object.entries(post.amenities)
                .filter(([, v]) => v)
                .map(([k]) => k)
                .join(", ")}
            />
          </div>
        </section>
      </div>

      <FormActions
        onBack={() => navigate("/post-property/amenities")}
        onNext={submit}
        nextLabel={isEditMode ? "Update Property" : "Submit property"}
        nextDisabled={!isReadyToSubmit}
        nextLoading={post.submitLoading}
        rightExtra={
          <Button
            type="button"
            onClick={() => navigate("/post-property/basic")}
            className="w-full sm:w-auto rounded-md border border-[var(--b2)] px-4 py-2 text-sm font-semibold hover:bg-[var(--b1-mid)] transition"
          >
            Edit details
          </Button>
        }
      />
    </div>
  );
}

