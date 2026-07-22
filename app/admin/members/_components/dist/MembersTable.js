"use client";
"use strict";
exports.__esModule = true;
var datatable_1 = require("@/components/ui/datatable");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var ACCOUNT_STATUS_BADGE = {
    ACTIVE: "bg-green-100 text-green-800 border-green-200",
    INACTIVE: "bg-gray-100 text-gray-800 border-gray-200",
    SUSPENDED: "bg-amber-100 text-amber-800 border-amber-200",
    ARCHIVED: "bg-red-100 text-red-800 border-red-200"
};
var roleBadgeColor = {
    ADMIN: "bg-red-100 text-red-800",
    WORKER: "bg-blue-100 text-blue-800",
    MEMBER: "bg-gray-100 text-gray-800"
};
var statusBadgeColor = {
    FIRST_TIMER: "bg-yellow-100 text-yellow-800",
    VISITOR: "bg-purple-100 text-purple-800",
    MEMBER: "bg-green-100 text-green-800"
};
function MembersTable(_a) {
    var data = _a.data, onEdit = _a.onEdit, onChurchJourney = _a.onChurchJourney, onSetPassword = _a.onSetPassword, onDelete = _a.onDelete, onSendInvite = _a.onSendInvite, onUpdateStatus = _a.onUpdateStatus;
    var columns = [
        {
            header: "Name",
            accessorFn: function (row) { return row.firstName + " " + row.lastName; },
            cell: function (_a) {
                var row = _a.row;
                return (React.createElement("div", null,
                    React.createElement("div", { className: "font-medium" },
                        row.original.firstName,
                        " ",
                        row.original.lastName),
                    React.createElement("div", { className: "text-sm text-gray-500" }, row.original.email)));
            }
        },
        {
            header: "Phone",
            accessorKey: "phoneNumber"
        },
        {
            header: "Church Status",
            accessorKey: "churchStatus",
            cell: function (_a) {
                var _b;
                var row = _a.row;
                return (React.createElement(badge_1.Badge, { variant: "outline", className: statusBadgeColor[row.original.churchStatus] || "" }, (_b = row.original.churchStatus) === null || _b === void 0 ? void 0 : _b.replace("_", " ")));
            }
        },
        {
            header: "Role",
            accessorKey: "role",
            cell: function (_a) {
                var row = _a.row;
                return (React.createElement(badge_1.Badge, { variant: "outline", className: roleBadgeColor[row.original.role || "MEMBER"] || "" }, row.original.role || "MEMBER"));
            }
        },
        {
            header: "Status",
            accessorKey: "accountStatus",
            cell: function (_a) {
                var _b;
                var row = _a.row;
                var s = ((_b = row.original.accountStatus) !== null && _b !== void 0 ? _b : "ACTIVE");
                return (React.createElement(badge_1.Badge, { variant: "outline", className: ACCOUNT_STATUS_BADGE[s] }, s));
            }
        },
        {
            header: "Joined",
            accessorKey: "createdAt",
            cell: function (_a) {
                var row = _a.row;
                return row.original.createdAt
                    ? new Date(row.original.createdAt).toLocaleDateString()
                    : "-";
            }
        },
        {
            id: "actions",
            header: "",
            enableSorting: false,
            cell: function (_a) {
                var row = _a.row;
                return (React.createElement(dropdown_menu_1.DropdownMenu, null,
                    React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                        React.createElement(button_1.Button, { variant: "ghost", size: "icon" },
                            React.createElement(lucide_react_1.MoreHorizontal, { className: "h-4 w-4" }))),
                    React.createElement(dropdown_menu_1.DropdownMenuContent, { align: "end" },
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return onEdit(row.original); } },
                            React.createElement(lucide_react_1.Pencil, { className: "h-4 w-4 mr-2" }),
                            " Edit Profile"),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return onChurchJourney(row.original); } },
                            React.createElement(lucide_react_1.UserCog, { className: "h-4 w-4 mr-2" }),
                            " Church Journey"),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return onSetPassword(row.original); } },
                            React.createElement(lucide_react_1.Key, { className: "h-4 w-4 mr-2" }),
                            " Set Password"),
                        onSendInvite && (React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return onSendInvite(row.original); } },
                            React.createElement(lucide_react_1.Mail, { className: "h-4 w-4 mr-2" }),
                            " Send Invite Email")),
                        onUpdateStatus && (React.createElement(AccountStatusItems, { user: row.original, onUpdateStatus: onUpdateStatus })),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return onDelete(row.original); }, className: "text-red-600" },
                            React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4 mr-2" }),
                            " Delete"))));
            }
        },
    ];
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "hidden md:block" },
            React.createElement(datatable_1.DataTable, { columns: columns, data: data, searchPlaceholder: "Search members..." })),
        React.createElement("div", { className: "space-y-4 md:hidden" }, data.map(function (user) { return (React.createElement(MemberCard, { key: user.id, user: user, onEdit: onEdit, onChurchJourney: onChurchJourney, onSetPassword: onSetPassword, onDelete: onDelete, onSendInvite: onSendInvite, onUpdateStatus: onUpdateStatus })); }))));
}
exports["default"] = MembersTable;
/** Row-menu items for the account-status lifecycle. Only shows the
 *  transitions that make sense from the user's current status. */
function AccountStatusItems(_a) {
    var _b;
    var user = _a.user, onUpdateStatus = _a.onUpdateStatus;
    var current = ((_b = user.accountStatus) !== null && _b !== void 0 ? _b : "ACTIVE");
    var items = [];
    if (current !== "ACTIVE")
        items.push({
            label: "Restore (Active)",
            status: "ACTIVE",
            icon: React.createElement(lucide_react_1.RotateCcw, { className: "h-4 w-4 mr-2" })
        });
    if (current !== "SUSPENDED" && current !== "ARCHIVED")
        items.push({
            label: "Suspend",
            status: "SUSPENDED",
            icon: React.createElement(lucide_react_1.Ban, { className: "h-4 w-4 mr-2" })
        });
    if (current !== "INACTIVE" && current !== "ARCHIVED")
        items.push({
            label: "Mark Inactive",
            status: "INACTIVE",
            icon: React.createElement(lucide_react_1.CircleSlash, { className: "h-4 w-4 mr-2" })
        });
    if (current !== "ARCHIVED")
        items.push({
            label: "Archive",
            status: "ARCHIVED",
            icon: React.createElement(lucide_react_1.Archive, { className: "h-4 w-4 mr-2" })
        });
    if (items.length === 0)
        return null;
    return (React.createElement(React.Fragment, null,
        React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
        items.map(function (it) { return (React.createElement(dropdown_menu_1.DropdownMenuItem, { key: it.status, onClick: function () { return onUpdateStatus(user, it.status); } },
            it.icon,
            " ",
            it.label)); })));
}
function MemberCard(_a) {
    var _b;
    var user = _a.user, onEdit = _a.onEdit, onChurchJourney = _a.onChurchJourney, onSetPassword = _a.onSetPassword, onDelete = _a.onDelete, onSendInvite = _a.onSendInvite, onUpdateStatus = _a.onUpdateStatus;
    var status = ((_b = user.accountStatus) !== null && _b !== void 0 ? _b : "ACTIVE");
    return (React.createElement("div", { className: "rounded-lg border bg-white p-4 shadow-sm" },
        React.createElement("div", { className: "flex items-start justify-between" },
            React.createElement("div", null,
                React.createElement("h3", { className: "font-semibold" },
                    user.firstName,
                    " ",
                    user.lastName),
                React.createElement("p", { className: "text-sm text-muted-foreground" }, user.email),
                React.createElement("p", { className: "text-sm text-muted-foreground" }, user.phoneNumber || "-")),
            React.createElement(dropdown_menu_1.DropdownMenu, null,
                React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                    React.createElement(button_1.Button, { variant: "ghost", size: "icon" },
                        React.createElement(lucide_react_1.MoreHorizontal, { className: "h-5 w-5" }))),
                React.createElement(dropdown_menu_1.DropdownMenuContent, { align: "end" },
                    React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return onEdit(user); } },
                        React.createElement(lucide_react_1.Pencil, { className: "mr-2 h-4 w-4" }),
                        "Edit"),
                    React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return onChurchJourney(user); } },
                        React.createElement(lucide_react_1.UserCog, { className: "mr-2 h-4 w-4" }),
                        "Church Journey"),
                    React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return onSetPassword(user); } },
                        React.createElement(lucide_react_1.Key, { className: "mr-2 h-4 w-4" }),
                        "Set Password"),
                    onSendInvite && (React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return onSendInvite(user); } },
                        React.createElement(lucide_react_1.Mail, { className: "mr-2 h-4 w-4" }),
                        "Send Invite")),
                    onUpdateStatus && (React.createElement(AccountStatusItems, { user: user, onUpdateStatus: onUpdateStatus })),
                    React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
                    React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return onDelete(user); }, className: "text-red-600" },
                        React.createElement(lucide_react_1.Trash2, { className: "mr-2 h-4 w-4" }),
                        "Delete")))),
        React.createElement("div", { className: "mt-4 flex flex-wrap gap-2" },
            React.createElement(badge_1.Badge, { variant: "outline", className: roleBadgeColor[user.role || "MEMBER"] }, user.role),
            React.createElement(badge_1.Badge, { variant: "outline", className: statusBadgeColor[user.churchStatus] }, user.churchStatus),
            React.createElement(badge_1.Badge, { variant: "outline", className: ACCOUNT_STATUS_BADGE[status] }, status)),
        React.createElement("div", { className: "mt-3 text-xs text-muted-foreground" },
            "Joined",
            " ",
            user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-")));
}
