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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        ? { surveyNumber: "postProperty.validation.surveyNumberRequired" }
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
        title: t("postProperty.toast.reviewRequired"),
        detail: t("postProperty.toast.reviewRequiredDetail"),
      });
      return;
    }

    const result = await dispatch(submitPostProperty());
    if (submitPostProperty.fulfilled.match(result)) {
      pushToast({
        kind: "success",
        title: isEditMode
          ? t("postProperty.toast.propertyUpdated")
          : t("postProperty.toast.propertySubmitted"),
      });
      if (isEditMode) {
        window.alert(t("postProperty.alert.updateSuccess"));
      } else {
        window.alert(t("postProperty.alert.submitSuccess"));
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
        title: t("postProperty.toast.submissionFailed"),
        detail: result.payload ? String(result.payload) : post.submitError ?? t("postProperty.toast.tryAgain"),
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--b1)]">
            {t("postProperty.review.stepTitle")}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {t("postProperty.review.stepSubtitle")}
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            dispatch(saveDraftNow());
            pushToast({ kind: "success", title: t("postProperty.toast.draftSaved") });
          }}
          className="rounded-md border border-[var(--b2)] px-4 py-2 text-sm font-semibold hover:bg-[var(--b1-mid)] transition"
        >
          {t("postProperty.review.saveDraft")}
        </Button>
      </div>

      {!isReadyToSubmit && (
        <div className="mt-5 rounded-xl border border-[var(--warning)] bg-[var(--warning-bg)] px-4 py-3">
          <p className="text-sm font-semibold text-[var(--warning)]">
            {t("postProperty.review.attentionTitle")}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {t("postProperty.review.attentionSubtitle")}
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--b1)]">{t("postProperty.review.basicDetails")}</p>
            <Button
              type="button"
              onClick={() => navigate("/post-property/basic")}
              className="text-xs font-semibold hover:bg-[var(--b1-mid)]"
            >
              {t("postProperty.common.edit")}
            </Button>
          </div>
          <div className="mt-3 divide-y divide-[var(--b2)]">
            <SummaryRow label={t("postProperty.review.listingType")} value={post.basicDetails.listingType} />
            <SummaryRow label={t("postProperty.review.category")} value={post.basicDetails.category} />
            <SummaryRow label={t("postProperty.review.propertyType")} value={post.basicDetails.propertyType} />
            <SummaryRow label={t("postProperty.review.title")} value={post.basicDetails.title} />
            <SummaryRow label={t("postProperty.review.contact")} value={`${post.basicDetails.contactName} • ${post.basicDetails.contactMobile}`} />
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--b1)]">{t("postProperty.review.location")}</p>
            <Button
              type="button"
              onClick={() => navigate("/post-property/location")}
              className="text-xs font-semibold hover:bg-[var(--b1-mid)]"
            >
              {t("postProperty.common.edit")}
            </Button>
          </div>
          <div className="mt-3 divide-y divide-[var(--b2)]">
            <SummaryRow label={t("postProperty.location.state")} value={post.locationDetails.state} />
            <SummaryRow label={t("postProperty.location.city")} value={post.locationDetails.city} />
            <SummaryRow label={t("postProperty.location.tehsil")} value={post.locationDetails.tehsil} />
            <SummaryRow label={t("postProperty.location.village")} value={post.locationDetails.village} />
            <SummaryRow label={t("postProperty.location.locality")} value={post.locationDetails.locality} />
            <SummaryRow label={t("postProperty.review.surveyNo")} value={post.locationDetails.surveyNumber} />
            <SummaryRow label={t("postProperty.location.pinCode")} value={post.locationDetails.pinCode} />
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--b1)]">{t("postProperty.steps.profile")}</p>
            <Button
              type="button"
              onClick={() => navigate("/post-property/profile")}
              className="text-xs font-semibold hover:bg-[var(--b1-mid)]"
            >
              {t("postProperty.common.edit")}
            </Button>
          </div>
          <div className="mt-3 divide-y divide-[var(--b2)]">
            <SummaryRow
              label={t("postProperty.review.area")}
              value={
                post.profileDetails.totalArea != null
                  ? `${post.profileDetails.totalArea} ${post.profileDetails.areaUnit}`
                  : ""
              }
            />
            <SummaryRow
              label={t("postProperty.profile.price")}
              value={
                post.profileDetails.price != null
                  ? `₹ ${post.profileDetails.price.toLocaleString("en-IN")}${
                      post.profileDetails.negotiable ? ` (${t("postProperty.profile.negotiable")})` : ""
                    }`
                  : ""
              }
            />
            <SummaryRow label={t("postProperty.review.ownership")} value={post.profileDetails.ownershipType} />
            <SummaryRow label={t("postProperty.review.soil")} value={post.profileDetails.soilType} />
            <SummaryRow
              label={t("postProperty.profile.suitableFor")}
              value={post.profileDetails.suitableFor.join(", ")}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--b1)]">{t("postProperty.review.mediaAmenities")}</p>
            <Button
              type="button"
              onClick={() => navigate("/post-property/media")}
              className="text-xs font-semibold"
            >
              {t("postProperty.common.edit")}
            </Button>
          </div>
          <div className="mt-3 divide-y divide-[var(--b2)]">
            <SummaryRow label={t("postProperty.review.images")} value={`${post.media.images.length}`} />
            {post.media.images.length > 0 && (
              <div className="py-3">
                <p className="text-xs font-semibold text-[var(--muted)]">{t("postProperty.review.imagePreview")}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {post.media.images.map((image) => (
                    <div
                      key={image.id}
                      className="overflow-hidden rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40"
                    >
                      <div className="aspect-[4/3] w-full">
                        <img
                          src={image.url}
                          alt={image.fileName || t("postProperty.media.propertyImageAlt")}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <SummaryRow label={t("postProperty.review.documents")} value={`${post.media.documents.length}`} />
            {post.media.documents.length > 0 && (
              <div className="py-3">
                <p className="text-xs font-semibold text-[var(--muted)]">{t("postProperty.review.documentsPreview")}</p>
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
                              alt={doc.fileName || t("postProperty.review.document")}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[var(--muted)]">
                              <FileText className="h-8 w-8" strokeWidth={1.75} aria-hidden />
                            </div>
                          )}
                        </div>
                        <p className="truncate border-t border-[var(--b2)] px-2 py-1.5 text-[10px] text-[var(--muted)]">
                          {doc.fileName || t("postProperty.review.document")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <SummaryRow
              label={t("postProperty.review.video")}
              value={formatVideoPreview(post.media.videoUrl ?? "")}
              singleLine
            />
            <SummaryRow
              label={t("postProperty.review.amenitiesSelected")}
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
        nextLabel={isEditMode ? t("postProperty.review.updateProperty") : t("postProperty.review.submitProperty")}
        nextDisabled={!isReadyToSubmit}
        nextLoading={post.submitLoading}
        rightExtra={
          <Button
            type="button"
            onClick={() => navigate("/post-property/basic")}
            className="w-full sm:w-auto rounded-md border border-[var(--b2)] px-4 py-2 text-sm font-semibold hover:bg-[var(--b1-mid)] transition"
          >
            {t("postProperty.review.editDetails")}
          </Button>
        }
      />
    </div>
  );
}

