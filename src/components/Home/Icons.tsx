interface IconProps {
  className?: string;
}

export const LocationIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 8c-4-4-6-6.686-6-9a6 6 0 1112 0c0 2.314-2 5-6 9z"
    />
  </svg>
);

export const CategoryIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
);

export const TypeIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z"
    />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
