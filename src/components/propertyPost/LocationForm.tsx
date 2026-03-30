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

function MapPickerFutureReady() {
  return (
    <div className="rounded-xl border border-dashed border-[var(--b2)] bg-[var(--b2-soft)]/40 p-4">
      <p className="text-sm font-semibold text-[var(--b1)]">Map picker</p>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Component structure is ready. Google Maps integration can be plugged in
        later without changing this module.
      </p>
    </div>
  );
}

export default function LocationForm() {
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
      e.surveyNumber = "Survey number is required for agriculture land";
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
        title: "Fix required fields",
        detail: "Please complete Location Details before continuing.",
      });
      return;
    }
    dispatch(markStepCompleted("location"));
    dispatch(saveDraftNow());
    pushToast({ kind: "success", title: "Draft saved" });
    navigate("/post-property/profile");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--b1)]">
        Step 2: Location Details
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Help buyers find your property accurately.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Field
          label="State"
          required
          value={location.state}
          onBlur={() => setTouched((p) => ({ ...p, state: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ state: v }))}
          error={showError("state") ? errors.state : undefined}
          placeholder="Madhya Pradesh"
        />
        <Field
          label="City"
          required
          value={location.city}
          onBlur={() => setTouched((p) => ({ ...p, city: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ city: v }))}
          error={showError("city") ? errors.city : undefined}
          placeholder="Indore"
        />
        <Field
          label="Tehsil"
          required
          value={location.tehsil}
          onBlur={() => setTouched((p) => ({ ...p, tehsil: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ tehsil: v }))}
          error={showError("tehsil") ? errors.tehsil : undefined}
          placeholder="Mhow"
        />
        <Field
          label="Village"
          required
          value={location.village}
          onBlur={() => setTouched((p) => ({ ...p, village: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ village: v }))}
          error={showError("village") ? errors.village : undefined}
          placeholder="Village name"
        />
        <Field
          label="Locality"
          required
          value={location.locality}
          onBlur={() => setTouched((p) => ({ ...p, locality: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ locality: v }))}
          error={showError("locality") ? errors.locality : undefined}
          placeholder="Nearby landmark/locality"
        />
        <Field
          label="Pin code"
          required
          value={location.pinCode}
          onBlur={() => setTouched((p) => ({ ...p, pinCode: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ pinCode: v }))}
          error={showError("pinCode") ? errors.pinCode : undefined}
          placeholder="452001"
        />

        <Field
          label="Survey number"
          required={category === "Agriculture Land"}
          value={location.surveyNumber}
          onBlur={() => setTouched((p) => ({ ...p, surveyNumber: true }))}
          onChange={(v) => dispatch(updateLocationDetails({ surveyNumber: v }))}
          error={showError("surveyNumber") ? errors.surveyNumber : undefined}
          placeholder="e.g. 123/2"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
              Latitude
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
              Longitude
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
        <MapPickerFutureReady />
      </div>

      <FormActions
        onBack={() => navigate("/post-property/basic")}
        onNext={onNext}
        nextLabel="Continue"
      />
    </div>
  );
}

