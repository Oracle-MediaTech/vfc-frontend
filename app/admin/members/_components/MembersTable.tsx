  "use client";

  import { ColumnDef } from "@tanstack/react-table";
  import { AccountStatus, IUser } from "@/types/user";
  import { DataTable } from "@/components/ui/datatable";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Mail, MoreHorizontal, Pencil, Key, Trash2, UserCog, Ban, Archive, RotateCcw, CircleSlash } from "lucide-react";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

  interface MembersTableProps {
    data: IUser[];
    onEdit: (user: IUser) => void;
    onChurchJourney: (user: IUser) => void;
    onSetPassword: (user: IUser) => void;
    onDelete: (user: IUser) => void;
    /** Optional: when provided, a "Send Invite" item is added to the row menu. */
    onSendInvite?: (user: IUser) => void;
    /** Optional: lifecycle status mutation. When provided, status actions appear. */
    onUpdateStatus?: (user: IUser, status: AccountStatus) => void;
  }

  const ACCOUNT_STATUS_BADGE: Record<AccountStatus, string> = {
    ACTIVE:    "bg-green-100 text-green-800 border-green-200",
    INACTIVE:  "bg-gray-100 text-gray-800 border-gray-200",
    SUSPENDED: "bg-amber-100 text-amber-800 border-amber-200",
    ARCHIVED:  "bg-red-100 text-red-800 border-red-200",
  };

  const roleBadgeColor: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-800",
    WORKER: "bg-blue-100 text-blue-800",
    MEMBER: "bg-gray-100 text-gray-800",
  };

  const statusBadgeColor: Record<string, string> = {
    FIRST_TIMER: "bg-yellow-100 text-yellow-800",
    VISITOR: "bg-purple-100 text-purple-800",
    MEMBER: "bg-green-100 text-green-800",
  };

  export default function MembersTable({
    data,
    onEdit,
    onChurchJourney,
    onSetPassword,
    onDelete,
    onSendInvite,
    onUpdateStatus,
  }: MembersTableProps) {
    const columns: ColumnDef<IUser>[] = [
      {
        header: "Name",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.original.firstName} {row.original.lastName}
            </div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
          </div>
        ),
      },
      {
        header: "Phone",
        accessorKey: "phoneNumber",
      },
      {
        header: "Church Status",
        accessorKey: "churchStatus",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={statusBadgeColor[row.original.churchStatus] || ""}
          >
            {row.original.churchStatus?.replace("_", " ")}
          </Badge>
        ),
      },
      {
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={roleBadgeColor[row.original.role || "MEMBER"] || ""}
          >
            {row.original.role || "MEMBER"}
          </Badge>
        ),
      },
      {
        header: "Status",
        accessorKey: "accountStatus",
        cell: ({ row }) => {
          const s = (row.original.accountStatus ?? "ACTIVE") as AccountStatus;
          return (
            <Badge variant="outline" className={ACCOUNT_STATUS_BADGE[s]}>
              {s}
            </Badge>
          );
        },
      },
      {
        header: "Joined",
        accessorKey: "createdAt",
        cell: ({ row }) =>
          row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString()
            : "-",
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="h-4 w-4 mr-2" /> Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChurchJourney(row.original)}>
                <UserCog className="h-4 w-4 mr-2" /> Church Journey
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSetPassword(row.original)}>
                <Key className="h-4 w-4 mr-2" /> Set Password
              </DropdownMenuItem>
              {onSendInvite && (
                <DropdownMenuItem onClick={() => onSendInvite(row.original)}>
                  <Mail className="h-4 w-4 mr-2" /> Send Invite Email
                </DropdownMenuItem>
              )}
              {onUpdateStatus && <AccountStatusItems user={row.original} onUpdateStatus={onUpdateStatus} />}
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];

    return (
      <>
       <div className="hidden md:block">
      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Search members..."
      />
    </div>
       <div className="space-y-4 md:hidden">
      {data.map((user) => (
        <MemberCard
          key={user.id}
          user={user}
          onEdit={onEdit}
          onChurchJourney={onChurchJourney}
          onSetPassword={onSetPassword}
          onDelete={onDelete}
          onSendInvite={onSendInvite}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
      </>
    );
  }

  /** Row-menu items for the account-status lifecycle. Only shows the
   *  transitions that make sense from the user's current status. */
  function AccountStatusItems({
    user,
    onUpdateStatus,
  }: {
    user: IUser;
    onUpdateStatus: (user: IUser, status: AccountStatus) => void;
  }) {
    const current = (user.accountStatus ?? "ACTIVE") as AccountStatus;
    const items: Array<{ label: string; status: AccountStatus; icon: React.ReactNode }> = [];

    if (current !== "ACTIVE") items.push({ label: "Restore (Active)", status: "ACTIVE", icon: <RotateCcw className="h-4 w-4 mr-2" /> });
    if (current !== "SUSPENDED" && current !== "ARCHIVED") items.push({ label: "Suspend", status: "SUSPENDED", icon: <Ban className="h-4 w-4 mr-2" /> });
    if (current !== "INACTIVE" && current !== "ARCHIVED") items.push({ label: "Mark Inactive", status: "INACTIVE", icon: <CircleSlash className="h-4 w-4 mr-2" /> });
    if (current !== "ARCHIVED") items.push({ label: "Archive", status: "ARCHIVED", icon: <Archive className="h-4 w-4 mr-2" /> });

    if (items.length === 0) return null;

    return (
      <>
        <DropdownMenuSeparator />
        {items.map((it) => (
          <DropdownMenuItem key={it.status} onClick={() => onUpdateStatus(user, it.status)}>
            {it.icon} {it.label}
          </DropdownMenuItem>
        ))}
      </>
    );
  }

  function MemberCard({
  user,
  onEdit,
  onChurchJourney,
  onSetPassword,
  onDelete,
  onSendInvite,
  onUpdateStatus,
}: {
  user: IUser;
  onEdit: (user: IUser) => void;
  onChurchJourney: (user: IUser) => void;
  onSetPassword: (user: IUser) => void;
  onDelete: (user: IUser) => void;
  onSendInvite?: (user: IUser) => void;
  onUpdateStatus?: (user: IUser, status: AccountStatus) => void;
}) {
  const status = (user.accountStatus ?? "ACTIVE") as AccountStatus;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">
            {user.firstName} {user.lastName}
          </h3>

          <p className="text-sm text-muted-foreground">
            {user.email}
          </p>

          <p className="text-sm text-muted-foreground">
            {user.phoneNumber || "-"}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onChurchJourney(user)}>
              <UserCog className="mr-2 h-4 w-4" />
              Church Journey
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onSetPassword(user)}>
              <Key className="mr-2 h-4 w-4" />
              Set Password
            </DropdownMenuItem>

            {onSendInvite && (
              <DropdownMenuItem onClick={() => onSendInvite(user)}>
                <Mail className="mr-2 h-4 w-4" />
                Send Invite
              </DropdownMenuItem>
            )}

            {onUpdateStatus && (
              <AccountStatusItems
                user={user}
                onUpdateStatus={onUpdateStatus}
              />
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">

        <Badge
          variant="outline"
          className={roleBadgeColor[user.role || "MEMBER"]}
        >
          {user.role}
        </Badge>

        <Badge
          variant="outline"
          className={statusBadgeColor[user.churchStatus]}
        >
          {user.churchStatus}
        </Badge>

        <Badge
          variant="outline"
          className={ACCOUNT_STATUS_BADGE[status]}
        >
          {status}
        </Badge>

      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        Joined{" "}
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "-"}
      </div>
    </div>
  );
}