import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import { Input, Button } from "@/components/common";
import { useAgentProfileLocal } from "./useAgentProfileLocal";

async function fileToOptimizedDataUrl(file: File, maxEdge = 480): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read image"));
    };
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Invalid image"));
    img.src = dataUrl;
  });

  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

const AgentProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { profile, saveProfile, saveError } = useAgentProfileLocal(user?.email);

  const fallbackName = useMemo(() => user?.name ?? "", [user?.name]);
  const fallbackMobile = useMemo(
    () => (typeof user?.mobile === "string" ? user.mobile : ""),
    [user?.mobile]
  );
  const fallbackEmail = useMemo(() => user?.email ?? "", [user?.email]);

  const [agentName, setAgentName] = useState("");
  const [mobileNumber, setMobileNumber] = useState(
    ""
  );
  const [email, setEmail] = useState("");
  const [assignedArea, setAssignedArea] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setAgentName(profile.displayName || fallbackName);
    setMobileNumber(profile.mobileNumber || fallbackMobile);
    setEmail(profile.email || fallbackEmail);
    setAssignedArea(profile.assignedArea || "");
    setProfilePhotoUrl(profile.profilePhotoUrl || "");
  }, [profile, fallbackName, fallbackMobile, fallbackEmail]);

  const initials = (agentName.trim().charAt(0) || "A").toUpperCase();
  const profileCompletion = useMemo(() => {
    const checks = [
      agentName.trim(),
      mobileNumber.trim(),
      email.trim(),
      assignedArea.trim(),
      profilePhotoUrl.trim(),
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [agentName, mobileNumber, email, assignedArea, profilePhotoUrl]);

  const handleImageUpload = async (file?: File) => {
    if (!file) return;
    try {
      const optimizedUrl = await fileToOptimizedDataUrl(file);
      setProfilePhotoUrl(optimizedUrl);
      setSaveMessage(null);
    } catch {
      setSaveMessage("Unable to process image. Try another file.");
    }
  };

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">Agent Profile</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Update your profile details and assigned area.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
        <div className="mb-4 rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(var(--b1) ${profileCompletion * 3.6}deg, var(--b2) 0deg)`,
                }}
              />
              <div className="absolute inset-[3px] overflow-hidden rounded-full border border-[var(--b2)] bg-[var(--white)]">
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt="Agent profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-serif text-base font-semibold text-[var(--b1-mid)]">
                    {initials}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 rounded-full border border-[var(--b2)] bg-[var(--white)] px-1.5 py-[1px] text-[10px] font-semibold text-[var(--b1)]">
                {profileCompletion}%
              </div>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--b1)]">{agentName || "Agent"}</p>
              <p className="text-xs text-[var(--muted)]">Profile preview</p>
            </div>
          </div>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setIsSaving(true);
            setSaveMessage(null);
            const ok = saveProfile({
              displayName: agentName.trim(),
              mobileNumber: mobileNumber.trim(),
              email: email.trim(),
              assignedArea: assignedArea.trim(),
              profilePhotoUrl,
            });
            setIsSaving(false);
            setSaveMessage(ok ? "Profile saved successfully." : "Profile saved with limited data.");
          }}
        >
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="profilePhoto">
              Profile Image
            </label>
            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="agentName">
                Agent Name
              </label>
              <Input
                id="agentName"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
                required
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="mobileNumber"
              >
                Mobile Number
              </label>
              <Input
                id="mobileNumber"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                inputMode="numeric"
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
                placeholder="Required"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="assignedArea"
              >
                Assigned Area
              </label>
              <Input
                id="assignedArea"
                value={assignedArea}
                onChange={(e) => setAssignedArea(e.target.value)}
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
                placeholder="Village/Tehsil/District"
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="basicSettings"
            >
              Basic Settings
            </label>
            <div
              id="basicSettings"
              className="rounded-md border border-dashed border-[var(--b2)] bg-[var(--b2-soft)]/40 px-3 py-3 text-sm text-[var(--muted)]"
            >
              Basic settings placeholder
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--b1)] transition"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
          {saveMessage ? (
            <p className="text-xs text-[var(--b1)]">{saveMessage}</p>
          ) : null}
          {saveError ? (
            <p className="text-xs text-[var(--error)]">
              {saveError}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
};

export default AgentProfilePage;

