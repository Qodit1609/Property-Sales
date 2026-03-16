import { useNavigate, useOutletContext } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  markStepCompleted,
  saveDraftNow,
  setAmenities,
} from "../../features/postProperty/postPropertySlice";
import type { AmenityKey } from "../../features/postProperty/postPropertyTypes";
import FormActions from "./FormActions";
import type { PostPropertyOutletContext } from "./postPropertyOutletContext";

const OPTIONS: Array<{ key: AmenityKey; label: string; desc: string }> = [
  { key: "borewell", label: "Borewell", desc: "Reliable groundwater source" },
  { key: "dripIrrigation", label: "Drip irrigation", desc: "Water-efficient setup" },
  { key: "fencing", label: "Fencing", desc: "Boundary fencing available" },
  { key: "electricityConnection", label: "Electricity connection", desc: "Active power connection" },
  { key: "farmRoad", label: "Farm road", desc: "Internal/approach farm road" },
  { key: "nearbyHighway", label: "Nearby highway", desc: "Good connectivity" },
  { key: "storageFacility", label: "Storage facility", desc: "Godown/storage space" },
  { key: "security", label: "Security", desc: "On-site security" },
];

export default function AmenitiesForm() {
  const { pushToast } = useOutletContext<PostPropertyOutletContext>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const amenities = useAppSelector((s) => s.postProperty.amenities);

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--b1)]">
        Step 5: Amenities / Features
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Select what applies. This helps users filter and compare.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPTIONS.map((a) => {
          const checked = amenities[a.key];
          return (
            <label
              key={a.key}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-4 cursor-pointer transition ${
                checked
                  ? "border-[var(--b1-mid)] bg-[var(--b2-soft)]"
                  : "border-[var(--b2)] bg-[var(--white)] hover:bg-[var(--b2-soft)]"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) =>
                  dispatch(setAmenities({ [a.key]: e.target.checked }))
                }
                className="mt-1 h-4 w-4"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--b1)]">
                  {a.label}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted)] line-clamp-2">
                  {a.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      <FormActions
        onBack={() => navigate("/post-property/media")}
        onNext={() => {
          dispatch(markStepCompleted("amenities"));
          dispatch(saveDraftNow());
          pushToast({ kind: "success", title: "Draft saved" });
          navigate("/post-property/review");
        }}
        nextLabel="Continue"
      />
    </div>
  );
}

