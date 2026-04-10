import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  markStepCompleted,
  saveDraftNow,
  updateLocationDetails,
} from "../../features/postProperty/postPropertySlice";
import { validateLocationDetails } from "../../features/postProperty/postPropertyValidation";
import FormActions from "./FormActions";
import type { PostPropertyOutletContext } from "./postPropertyOutletContext";
import { Input } from "@/components/common";
import { useTranslation } from "react-i18next";

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  error,
  onBlur,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  onBlur?: () => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
        {label} {required ? "*" : ""}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
          error ? "border-[var(--error)]" : "border-[var(--b2)]"
        }`}
      />
      {error && <p className="mt-1 text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
}

function MapPickerFutureReady({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)]/40 p-4">
      <p className="text-sm font-semibold text-[var(--b1)]">{title}</p>
      <p className="mt-1 text-xs text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}

export default function LocationForm() {
  const { t } = useTranslation();
  const { pushToast } = useOutletContext<PostPropertyOutletContext>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useAppSelector((s) => s.postProperty.locationDetails);
  const category = useAppSelector((s) => s.postProperty.basicDetails.category);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const baseErrors = useMemo(() => validateLocationDetails(location), [location]);

  const errors = useMemo(() => {
    const e = { ...baseErrors } as Record<string, string | undefined>;
    if (category === "Agriculture Land" && !location.surveyNumber.trim()) {
      e.surveyNumber = "postProperty.validation.surveyNumberRequired";
    }
    return e;
  }, [baseErrors, category, location.surveyNumber]);

  const showError = (key: string) => Boolean(touched[key] && errors[key]);

  const onNext = () => {
    setTouched({
      state: true,
      city: true,
      tehsil: true,
      village: true,
      locality: true,
      pinCode: true,
      surveyNumber: true,
    });

    const hasError = Object.values(errors).some(Boolean);
    if (hasError) {
      pushToast({
        kind: "error",
        title: t("postProperty.toast.fixRequiredFields"),
        detail: t("postProperty.toast.completeLocationDetails"),
      });
      return;
    }
    dispatch(markStepCompleted("location"));
    dispatch(saveDraftNow());
    pushToast({ kind: "success", title: t("postProperty.toast.draftSaved") });
    navigate("/post-property/profile");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--b1)]">
        {t("postProperty.location.stepTitle")}
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {t("postProperty.location.stepSubtitle")}
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Field
          label={t("postProperty.location.state")}
          required
          value={location.state}
          onBlur={() => setTouched((p) => ({ ...p, state: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ state: v }))}
          error={showError("state") ? t(errors.state || "") : undefined}
          placeholder={t("postProperty.location.statePlaceholder")}
        />
        <Field
          label={t("postProperty.location.city")}
          required
          value={location.city}
          onBlur={() => setTouched((p) => ({ ...p, city: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ city: v }))}
          error={showError("city") ? t(errors.city || "") : undefined}
          placeholder={t("postProperty.location.cityPlaceholder")}
        />
        <Field
          label={t("postProperty.location.district")}
          value={location.district}
          onChange={(v) => dispatch(updateLocationDetails({ district: v }))}
          placeholder={t("postProperty.location.districtPlaceholder")}
        />
        <Field
          label={t("postProperty.location.tehsil")}
          required
          value={location.tehsil}
          onBlur={() => setTouched((p) => ({ ...p, tehsil: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ tehsil: v }))}
          error={showError("tehsil") ? t(errors.tehsil || "") : undefined}
          placeholder={t("postProperty.location.tehsilPlaceholder")}
        />
        <Field
          label={t("postProperty.location.village")}
          required
          value={location.village}
          onBlur={() => setTouched((p) => ({ ...p, village: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ village: v }))}
          error={showError("village") ? t(errors.village || "") : undefined}
          placeholder={t("postProperty.location.villagePlaceholder")}
        />
        <Field
          label={t("postProperty.location.address")}
          value={location.address}
          onChange={(v) => dispatch(updateLocationDetails({ address: v }))}
          placeholder={t("postProperty.location.addressPlaceholder")}
        />
        <Field
          label={t("postProperty.location.landmark")}
          value={location.landmark}
          onChange={(v) => dispatch(updateLocationDetails({ landmark: v }))}
          placeholder={t("postProperty.location.landmarkPlaceholder")}
        />
        <Field
          label={t("postProperty.location.locality")}
          required
          value={location.locality}
          onBlur={() => setTouched((p) => ({ ...p, locality: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ locality: v }))}
          error={showError("locality") ? t(errors.locality || "") : undefined}
          placeholder={t("postProperty.location.localityPlaceholder")}
        />
        <Field
          label={t("postProperty.location.pinCode")}
          required
          value={location.pinCode}
          onBlur={() => setTouched((p) => ({ ...p, pinCode: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ pinCode: v }))}
          error={showError("pinCode") ? t(errors.pinCode || "") : undefined}
          placeholder="452001"
        />

        <Field
          label={t("postProperty.location.surveyNumber")}
          required={category === "Agriculture Land"}
          value={location.surveyNumber}
          onBlur={() => setTouched((p) => ({ ...p, surveyNumber: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ surveyNumber: v }))}
          error={showError("surveyNumber") ? t(errors.surveyNumber || "") : undefined}
          placeholder={t("postProperty.location.surveyNumberPlaceholder")}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
              {t("postProperty.location.latitude")}
            </label>
            <Input
              value={location.latitude ?? ""}
              onChange={(e) =>
                dispatch(
                  updateLocationDetails({
                    latitude: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              placeholder="22.7196"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
              {t("postProperty.location.longitude")}
            </label>
            <Input
              value={location.longitude ?? ""}
              onChange={(e) =>
                dispatch(
                  updateLocationDetails({
                    longitude: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              placeholder="75.8577"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <MapPickerFutureReady
          title={t("postProperty.location.mapPickerTitle")}
          description={t("postProperty.location.mapPickerDescription")}
        />
      </div>

      <FormActions
        onBack={() => navigate("/post-property/basic")}
        onNext={onNext}
        nextLabel={t("postProperty.common.continue")}
      />
    </div>
  );
}

