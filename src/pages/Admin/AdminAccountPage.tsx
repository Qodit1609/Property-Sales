import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Camera,
  Clock,
  ImageIcon,
  Loader2,
  MapPin,
  Pencil,
  Shield,
  Sliders,
  User,
  X,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Button, Input } from "@/components/common";
import { ToastStack, type ToastMessage } from "@/components/propertyPost/Toast";
import { useAppSelector } from "../../hooks/reduxHooks";
import type { AdminProfileData, AdminProfileSection } from "../../features/admin/adminProfileTypes";
import {
  buildUpdatePayload,
  fetchAdminUserById,
  updateAdminUserProfile,
  uploadAdminProfileAsset,
} from "../../features/admin/adminProfileAPI";
import {
  emptyAdminProfile,
  validateAddress,
  validateBasicInfo,
  validatePasswordChange,
} from "../../features/admin/adminAccountHelpers";

function cloneProfile(p: AdminProfileData): AdminProfileData {
  return JSON.parse(JSON.stringify(p)) as AdminProfileData;
}

const EDITABLE_SECTIONS: AdminProfileSection[] = [
  "basicInfo",
  "security",
  "professional",
  "address",
  "preferences",
  "media",
];

function formatDisplayDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

function SectionShell({
  title,
  icon: Icon,
  children,
  actions,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--b2-soft)] text-[var(--b1)]">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="text-base font-semibold text-[var(--b1)]">{title}</h2>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function AccountSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4].map((k) => (
        <div
          key={k}
          className="h-36 rounded-2xl bg-[var(--b2)]/40"
        />
      ))}
    </div>
  );
}

const AdminAccountPage: React.FC = () => {
  const authUser = useAppSelector((s) => s.auth.user);
  const userId = String(authUser?.id ?? authUser?._id ?? "");

  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<AdminProfileSection | "all" | null>(null);
  const [profile, setProfile] = useState<AdminProfileData>(emptyAdminProfile());
  const [form, setForm] = useState<AdminProfileData>(emptyAdminProfile());
  const [rawUser, setRawUser] = useState<Record<string, unknown> | null>(null);
  const [editing, setEditing] = useState<Set<AdminProfileSection>>(() => new Set());

  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [docPending, setDocPending] = useState<File | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const pushToast = useCallback((t: Omit<ToastMessage, "id">) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    setToasts((prev) => [...prev, { id, ...t }]);
  }, []);
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const isEditing = useCallback(
    (s: AdminProfileSection) => editing.has(s),
    [editing]
  );

  const startEdit = useCallback(
    (s: AdminProfileSection) => {
      setEditing((prev) => new Set(prev).add(s));
    },
    []
  );

  const stopEdit = useCallback((s: AdminProfileSection) => {
    setEditing((prev) => {
      const n = new Set(prev);
      n.delete(s);
      return n;
    });
  }, []);

  const resetSectionFromProfile = useCallback(
    (s: AdminProfileSection) => {
      if (s === "security") setPwd({ current: "", next: "", confirm: "" });
      if (s === "media") {
        setPendingAvatar(null);
        if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
        setDocPending(null);
      }
      setForm((f) => {
        const next = cloneProfile(f);
        if (s === "basicInfo") next.basicInfo = { ...profile.basicInfo };
        if (s === "professional") next.professional = { ...profile.professional };
        if (s === "address") next.address = { ...profile.address };
        if (s === "preferences") next.preferences = { ...profile.preferences };
        if (s === "media") {
          next.media = {
            profileImage: profile.media.profileImage,
            otherDocuments: [...profile.media.otherDocuments],
          };
          next.basicInfo = { ...next.basicInfo, profileImage: profile.basicInfo.profileImage };
        }
        return next;
      });
    },
    [profile, avatarPreview]
  );

  const load = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      pushToast({
        kind: "error",
        title: "Not signed in",
        detail: "Sign in again to manage your account.",
      });
      return;
    }
    setLoading(true);
    try {
      const { profile: p, raw } = await fetchAdminUserById(userId);
      setProfile(p);
      setForm(cloneProfile(p));
      setRawUser(raw);
    } catch (e) {
      pushToast({
        kind: "error",
        title: "Could not load profile",
        detail: e instanceof Error ? e.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, pushToast]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const displayAvatar = useMemo(() => {
    if (avatarPreview) return avatarPreview;
    return form.basicInfo.profileImage || form.media.profileImage || "";
  }, [avatarPreview, form.basicInfo.profileImage, form.media.profileImage]);

  const startEditAll = useCallback(() => {
    setForm(cloneProfile(profile));
    setPwd({ current: "", next: "", confirm: "" });
    setPendingAvatar(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    setEditing(new Set(EDITABLE_SECTIONS));
  }, [profile, avatarPreview]);

  const cancelAll = useCallback(() => {
    setForm(cloneProfile(profile));
    setPwd({ current: "", next: "", confirm: "" });
    setPendingAvatar(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    setDocPending(null);
    setEditing(new Set());
  }, [profile, avatarPreview]);

  const persist = useCallback(
    async (section: AdminProfileSection | "all") => {
      if (!userId || !rawUser) return;
      const errBasic = validateBasicInfo(form);
      if (errBasic) {
        pushToast({ kind: "error", title: "Validation", detail: errBasic });
        return;
      }
      const errAddr = validateAddress(form);
      if (errAddr) {
        pushToast({ kind: "error", title: "Validation", detail: errAddr });
        return;
      }
      if (section === "security" || section === "all") {
        const pErr = validatePasswordChange(pwd.current, pwd.next, pwd.confirm);
        if (pErr) {
          pushToast({ kind: "error", title: "Password", detail: pErr });
          return;
        }
      }

      setSavingSection(section);
      try {
        let working = form;
        const allowUpload = section === "media" || section === "all";
        if (allowUpload && pendingAvatar) {
          const url = await uploadAdminProfileAsset(pendingAvatar);
          working = cloneProfile(form);
          working.media.profileImage = url;
          working.basicInfo.profileImage = url;
          setPendingAvatar(null);
          if (avatarPreview) URL.revokeObjectURL(avatarPreview);
          setAvatarPreview(null);
          setForm(working);
        }

        if (allowUpload && docPending) {
          const url = await uploadAdminProfileAsset(docPending);
          working = cloneProfile(working);
          if (!working.media.otherDocuments.includes(url)) {
            working.media.otherDocuments = [...working.media.otherDocuments, url];
          }
          setDocPending(null);
          setForm(working);
        }

        const pw = pwd.next.trim() ? pwd.next : undefined;
        const payload = buildUpdatePayload(working, rawUser, pw);
        const { profile: updated, raw: nextRaw } = await updateAdminUserProfile(
          userId,
          payload
        );
        setProfile(updated);
        setForm(cloneProfile(updated));
        setRawUser(nextRaw);
        setPwd({ current: "", next: "", confirm: "" });
        if (section === "all") setEditing(new Set());
        else stopEdit(section);
        pushToast({ kind: "success", title: "Saved", detail: "Your profile was updated." });
      } catch (e) {
        pushToast({
          kind: "error",
          title: "Save failed",
          detail: e instanceof Error ? e.message : "Unknown error",
        });
      } finally {
        setSavingSection(null);
      }
    },
    [
      userId,
      rawUser,
      form,
      pendingAvatar,
      docPending,
      avatarPreview,
      pwd,
      pushToast,
      stopEdit,
    ]
  );

  const saveSection = (s: AdminProfileSection) => void persist(s);

  if (!userId) {
    return (
      <AdminLayout title="My Account">
        <p className="text-sm text-[var(--muted)]">You need to be logged in as an admin.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="My Account">
      <div className="mx-auto max-w-4xl space-y-6">
        <ToastStack toasts={toasts} onDismiss={dismissToast} />

        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[var(--b1)] sm:text-xl">
              My account
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              View and update your admin profile, security, and preferences.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {editing.size === 0 ? (
              <Button type="button" variant="primary" onClick={startEditAll}>
                <Pencil className="mr-1.5 h-4 w-4" />
                Edit profile
              </Button>
            ) : (
              <>
                <Button type="button" variant="ghost" onClick={cancelAll}>
                  <X className="mr-1.5 h-4 w-4" />
                  Cancel all
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={savingSection !== null}
                  onClick={() => void persist("all")}
                >
                  {savingSection === "all" ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : null}
                  Save all
                </Button>
              </>
            )}
          </div>
        </header>

        {loading ? (
          <AccountSkeleton />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Basic */}
            <div className="lg:col-span-2">
              <SectionShell
                title="Basic info"
                icon={User}
                actions={
                  !isEditing("basicInfo") ? (
                    <Button type="button" variant="ghost" size="sm" onClick={() => startEdit("basicInfo")}>
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          resetSectionFromProfile("basicInfo");
                          stopEdit("basicInfo");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        disabled={savingSection !== null}
                        onClick={() => void saveSection("basicInfo")}
                      >
                        {savingSection === "basicInfo" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </>
                  )
                }
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="relative mx-auto shrink-0 sm:mx-0">
                    <div className="h-24 w-24 overflow-hidden rounded-2xl border border-[var(--b2)] bg-[var(--b2-soft)]">
                      {displayAvatar ? (
                        <img
                          src={displayAvatar}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--muted)]">
                          <User className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <Input
                      label="Full name"
                      value={form.basicInfo.fullName}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          basicInfo: { ...f.basicInfo, fullName: e.target.value },
                        }))
                      }
                      disabled={!isEditing("basicInfo")}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={form.basicInfo.email}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          basicInfo: { ...f.basicInfo, email: e.target.value },
                        }))
                      }
                      disabled={!isEditing("basicInfo")}
                    />
                    <Input
                      label="Phone number"
                      value={form.basicInfo.phone}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          basicInfo: { ...f.basicInfo, phone: e.target.value },
                        }))
                      }
                      disabled={!isEditing("basicInfo")}
                      placeholder="+91 …"
                    />
                  </div>
                </div>
              </SectionShell>
            </div>

            {/* Security */}
            <SectionShell
              title="Security"
              icon={Shield}
              actions={
                !isEditing("security") ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => startEdit("security")}>
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        resetSectionFromProfile("security");
                        stopEdit("security");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      disabled={savingSection !== null}
                      onClick={() => void saveSection("security")}
                    >
                      {savingSection === "security" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </>
                )
              }
            >
              <Input
                label="Password"
                type="password"
                value={profile.security.passwordMasked}
                disabled
                className="opacity-90"
              />
              {isEditing("security") ? (
                <div className="space-y-3 rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 p-3">
                  <p className="text-xs font-medium text-[var(--b1)]">Change password</p>
                  <Input
                    label="Current password"
                    type="password"
                    autoComplete="current-password"
                    value={pwd.current}
                    onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                  />
                  <Input
                    label="New password"
                    type="password"
                    autoComplete="new-password"
                    value={pwd.next}
                    onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                  />
                  <Input
                    label="Confirm new password"
                    type="password"
                    autoComplete="new-password"
                    value={pwd.confirm}
                    onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                  />
                </div>
              ) : null}
            </SectionShell>

            {/* Professional */}
            <SectionShell
              title="Professional"
              icon={Briefcase}
              actions={
                !isEditing("professional") ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit("professional")}
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        resetSectionFromProfile("professional");
                        stopEdit("professional");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      disabled={savingSection !== null}
                      onClick={() => void saveSection("professional")}
                    >
                      {savingSection === "professional" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </>
                )
              }
            >
              <Input
                label="Role"
                value={form.professional.role}
                disabled
                className="capitalize"
              />
              <Input
                label="Experience (optional)"
                value={form.professional.experience}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    professional: { ...f.professional, experience: e.target.value },
                  }))
                }
                disabled={!isEditing("professional")}
                placeholder="e.g. 5 years"
              />
              <Input
                label="Department (optional)"
                value={form.professional.department}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    professional: { ...f.professional, department: e.target.value },
                  }))
                }
                disabled={!isEditing("professional")}
                placeholder="e.g. Operations"
              />
            </SectionShell>

            {/* Address */}
            <div className="lg:col-span-2">
              <SectionShell
                title="Address"
                icon={MapPin}
                actions={
                  !isEditing("address") ? (
                    <Button type="button" variant="ghost" size="sm" onClick={() => startEdit("address")}>
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          resetSectionFromProfile("address");
                          stopEdit("address");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        disabled={savingSection !== null}
                        onClick={() => void saveSection("address")}
                      >
                        {savingSection === "address" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </>
                  )
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Country"
                    value={form.address.country}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        address: { ...f.address, country: e.target.value },
                      }))
                    }
                    disabled={!isEditing("address")}
                  />
                  <Input
                    label="State"
                    value={form.address.state}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        address: { ...f.address, state: e.target.value },
                      }))
                    }
                    disabled={!isEditing("address")}
                  />
                  <Input
                    label="City"
                    value={form.address.city}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        address: { ...f.address, city: e.target.value },
                      }))
                    }
                    disabled={!isEditing("address")}
                  />
                  <Input
                    label="Zip code"
                    value={form.address.zipCode}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        address: { ...f.address, zipCode: e.target.value },
                      }))
                    }
                    disabled={!isEditing("address")}
                  />
                </div>
              </SectionShell>
            </div>

            {/* Preferences */}
            <SectionShell
              title="Preferences"
              icon={Sliders}
              actions={
                !isEditing("preferences") ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit("preferences")}
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        resetSectionFromProfile("preferences");
                        stopEdit("preferences");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      disabled={savingSection !== null}
                      onClick={() => void saveSection("preferences")}
                    >
                      {savingSection === "preferences" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </>
                )
              }
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-[var(--muted)]">Theme</span>
                <div className="flex flex-wrap gap-2">
                  {(["light", "dark"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      disabled={!isEditing("preferences")}
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          preferences: { ...f.preferences, theme: t },
                        }))
                      }
                      className={[
                        "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                        form.preferences.theme === t
                          ? "bg-[var(--b1)] text-white"
                          : "bg-[var(--b2-soft)] text-[var(--b1)] hover:bg-[var(--b2)]",
                        !isEditing("preferences") ? "opacity-70" : "",
                      ].join(" ")}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--b2)]"
                  checked={form.preferences.notifications}
                  disabled={!isEditing("preferences")}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      preferences: {
                        ...f.preferences,
                        notifications: e.target.checked,
                      },
                    }))
                  }
                />
                <span>Email & product notifications</span>
              </label>
            </SectionShell>

            {/* Activity */}
            <SectionShell title="Activity" icon={Clock}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-[var(--muted)]">Last login</p>
                  <p className="text-sm text-[var(--b1)]">
                    {formatDisplayDate(form.activity.lastLogin)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--muted)]">Account created</p>
                  <p className="text-sm text-[var(--b1)]">
                    {formatDisplayDate(form.activity.accountCreated)}
                  </p>
                </div>
              </div>
            </SectionShell>

            {/* Media */}
            <div className="lg:col-span-2">
              <SectionShell
                title="Media"
                icon={ImageIcon}
                actions={
                  !isEditing("media") ? (
                    <Button type="button" variant="ghost" size="sm" onClick={() => startEdit("media")}>
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          resetSectionFromProfile("media");
                          stopEdit("media");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        disabled={savingSection !== null}
                        onClick={() => void saveSection("media")}
                      >
                        {savingSection === "media" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </>
                  )
                }
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div>
                    <p className="mb-2 text-xs font-medium text-[var(--muted)]">
                      Profile image
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-20 w-20 overflow-hidden rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]">
                        {displayAvatar ? (
                          <img
                            src={displayAvatar}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[var(--muted)]">
                            <Camera className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      {isEditing("media") ? (
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)]">
                          <Camera className="h-4 w-4" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setPendingAvatar(file);
                              if (avatarPreview) URL.revokeObjectURL(avatarPreview);
                              setAvatarPreview(URL.createObjectURL(file));
                            }}
                          />
                        </label>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="mb-2 text-xs font-medium text-[var(--muted)]">
                      Other documents (optional)
                    </p>
                    {form.media.otherDocuments.length > 0 ? (
                      <ul className="space-y-1 text-sm">
                        {form.media.otherDocuments.map((url) => (
                          <li key={url}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[var(--b1)] underline underline-offset-2"
                            >
                              {url.slice(0, 48)}
                              {url.length > 48 ? "…" : ""}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-[var(--muted)]">No documents uploaded.</p>
                    )}
                    {isEditing("media") ? (
                      <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--b1)]">
                        <ImageIcon className="h-4 w-4" />
                        Add document
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setDocPending(file);
                          }}
                        />
                      </label>
                    ) : null}
                    {docPending ? (
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Ready to upload: {docPending.name}
                      </p>
                    ) : null}
                  </div>
                </div>
              </SectionShell>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAccountPage;
