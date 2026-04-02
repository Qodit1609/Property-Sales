import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  FileCheck,
  FileUp,
  KeyRound,
  LogIn,
  Mail,
  Search,
  Shield,
  ShieldOff,
  Trash2,
  UserCheck,
  UserPen,
  Eye,
  Bookmark,
  Phone,
  Pencil,
} from "lucide-react";

import type {
  ActivityLogEntry,
  ActivityLogRole,
  ActivityStatusTone,
  ActivityTypeCode,
} from "./activityLogTypes";

interface ActivityLogTableProps {
  rows: ActivityLogEntry[];
}

function roleBadgeClass(role: ActivityLogRole): string {
  if (role === "admin") return "bg-violet-500/15 text-violet-800";
  if (role === "seller") return "bg-sky-500/15 text-sky-800";
  return "bg-emerald-500/15 text-emerald-800";
}

function roleLabel(role: ActivityLogRole): string {
  if (role === "admin") return "Admin";
  if (role === "seller") return "Seller";
  return "Buyer";
}

function statusBadgeClass(tone: ActivityStatusTone): string {
  if (tone === "success") return "bg-emerald-500/15 text-emerald-700";
  if (tone === "warning") return "bg-amber-500/15 text-amber-800";
  if (tone === "danger") return "bg-rose-500/15 text-rose-700";
  if (tone === "info") return "bg-sky-500/15 text-sky-800";
  return "bg-slate-500/15 text-slate-700";
}

function activityIcon(type: ActivityTypeCode): React.ReactNode {
  const common = "h-4 w-4 shrink-0 text-[var(--b1-mid)]";
  const map: Record<ActivityTypeCode, React.ReactNode> = {
    PROPERTY_CREATED: <Building2 className={common} aria-hidden />,
    PROPERTY_EDITED: <Pencil className={common} aria-hidden />,
    PROPERTY_DELETED: <Trash2 className={common} aria-hidden />,
    DOCUMENT_UPLOADED: <FileUp className={common} aria-hidden />,
    SELLER_LOGIN: <LogIn className={common} aria-hidden />,
    PROFILE_UPDATED: <UserPen className={common} aria-hidden />,
    BUYER_LOGIN: <KeyRound className={common} aria-hidden />,
    PROPERTY_VIEWED: <Eye className={common} aria-hidden />,
    CONTACT_REQUEST: <Phone className={common} aria-hidden />,
    PROPERTY_SAVED: <Bookmark className={common} aria-hidden />,
    SEARCH_ACTIVITY: <Search className={common} aria-hidden />,
    PROPERTY_APPROVED: <FileCheck className={common} aria-hidden />,
    PROPERTY_REJECTED: <ShieldOff className={common} aria-hidden />,
    DOCUMENT_VERIFIED: <FileCheck className={common} aria-hidden />,
    USER_BLOCKED: <ShieldOff className={common} aria-hidden />,
    USER_VERIFIED: <UserCheck className={common} aria-hidden />,
  };
  return map[type] ?? <Mail className={common} aria-hidden />;
}

const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ rows }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--b2)]/90 bg-[var(--white)] shadow-md shadow-[var(--b1)]/5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--b2)] bg-[var(--b2-soft)]/80">
              <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">
                User
              </th>
              <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">
                Role
              </th>
              <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">
                Activity
              </th>
              <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">
                Target
              </th>
              <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">
                Date
              </th>
              <th className="px-4 py-3.5 font-semibold text-[var(--b1)] sm:px-5">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={false}
                whileHover={{ backgroundColor: "rgba(27, 67, 50, 0.04)" }}
                transition={{ duration: 0.15 }}
                className={[
                  "border-b border-[var(--b2)]/70 transition-colors",
                  index % 2 === 1 ? "bg-[var(--b2-soft)]/35" : "bg-[var(--white)]",
                ].join(" ")}
              >
                <td className="px-4 py-3.5 font-medium text-[var(--b1)] sm:px-5">
                  {row.userName}
                </td>
                <td className="px-4 py-3.5 sm:px-5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleBadgeClass(row.role)}`}
                  >
                    {roleLabel(row.role)}
                  </span>
                </td>
                <td className="px-4 py-3.5 sm:px-5">
                  <span className="flex items-center gap-2">
                    {activityIcon(row.activityType)}
                    <span className="text-[var(--b1)]">{row.activity}</span>
                  </span>
                </td>
                <td className="max-w-[200px] truncate px-4 py-3.5 text-[var(--b1-mid)] sm:max-w-xs sm:px-5">
                  {row.target}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[var(--b1-mid)] sm:px-5">
                  {row.date}
                </td>
                <td className="px-4 py-3.5 sm:px-5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(row.statusTone)}`}
                  >
                    {row.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 border-t border-[var(--b2)] bg-[var(--b2-soft)]/20 px-4 py-14 text-center">
          <Shield className="h-10 w-10 text-[var(--b1-mid)]" aria-hidden />
          <p className="font-medium text-[var(--b1)]">No activities match</p>
          <p className="text-sm text-[var(--muted)]">
            Adjust filters or search — connected APIs will stream live logs here.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ActivityLogTable;
