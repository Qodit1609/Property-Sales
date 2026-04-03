import { twMerge } from "tailwind-merge";

type ProfileAvatarProps = {
  name: string;
  photoUrl?: string | null;
  sizeClass?: string;
  className?: string;
};

export function ProfileAvatar({
  name,
  photoUrl,
  sizeClass = "h-10 w-10",
  className,
}: ProfileAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      className={twMerge(
        "shrink-0 overflow-hidden rounded-full border border-[var(--b2)] bg-[var(--b2-soft)] shadow-inner shadow-[var(--b2)]/30",
        sizeClass,
        className
      )}
    >
      {photoUrl ? (
        <img src={photoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-serif text-sm font-semibold text-[var(--b1-mid)]">
          {initial}
        </span>
      )}
    </div>
  );
}
