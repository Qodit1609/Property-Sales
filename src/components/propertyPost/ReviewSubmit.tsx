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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-xs font-semibold text-[var(--muted)]">{label}</span>
      <span className="text-sm font-medium text-[var(--b1)] text-right break-words">
        {value || "—"}
      </span>
    </div>
  );
}

export default function ReviewSubmit() {
  const { pushToast } = useOutletContext<PostPropertyOutletContext>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const post = useAppSelector((s) => s.postProperty);

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
    const profile = validateProfileDetails(post.profileDetails);
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
      pushToast({ kind: "success", title: "Property submitted" });
      const created = result.payload as unknown as { _id?: string };
      if (created?._id) {
        navigate(`/properties/${created._id}`, { replace: true });
      } else {
        navigate("/", { replace: true });
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
          className="rounded-md border border-[var(--b2)] px-4 py-2 text-sm font-semibold text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
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
              className="text-xs font-semibold text-[var(--b1-mid)] hover:text-[var(--b1)]"
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
              className="text-xs font-semibold text-[var(--b1-mid)] hover:text-[var(--b1)]"
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
              className="text-xs font-semibold text-[var(--b1-mid)] hover:text-[var(--b1)]"
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
              className="text-xs font-semibold text-[var(--b1-mid)] hover:text-[var(--b1)]"
            >
              Edit
            </Button>
          </div>
          <div className="mt-3 divide-y divide-[var(--b2)]">
            <SummaryRow label="Images" value={`${post.media.images.length}`} />
            <SummaryRow label="Video" value={post.media.videoUrl ?? ""} />
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
        nextLabel="Submit property"
        nextDisabled={!isReadyToSubmit}
        nextLoading={post.submitLoading}
        rightExtra={
          <Button
            type="button"
            onClick={() => navigate("/post-property/basic")}
            className="w-full sm:w-auto rounded-md border border-[var(--b2)] px-4 py-2 text-sm font-semibold text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
          >
            Edit details
          </Button>
        }
      />
    </div>
  );
}

