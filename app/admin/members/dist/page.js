"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
var userService_1 = require("@/services/userService");
var authService_1 = require("@/services/authService");
var MembersTable_1 = require("./_components/MembersTable");
var ChurchJourneyDialog_1 = require("./_components/ChurchJourneyDialog");
var SetPasswordDialog_1 = require("./_components/SetPasswordDialog");
var BulkImportDialog_1 = require("./_components/BulkImportDialog");
var RegisterMemberDialog_1 = require("./_components/RegisterMemberDialog");
var EditMemberDialog_1 = require("./_components/EditMemberDialog");
// Members view is scoped to churchStatus=MEMBER. First timers + visitors live
// at /admin/visitors so the lists stay focused. Default accountStatus filter
// to ACTIVE so suspended/archived users don't clutter the list — admins can
// flip to "all" or a specific status when needed.
var MEMBERS_ONLY = {
    page: 1,
    limit: 20,
    churchStatus: "MEMBER",
    accountStatus: "ACTIVE"
};
function MembersPage() {
    var _this = this;
    var _a = react_1.useState([]), members = _a[0], setMembers = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState({
        page: 1,
        totalPages: 1,
        total: 0
    }), pagination = _c[0], setPagination = _c[1];
    var _d = react_1.useState(MEMBERS_ONLY), filters = _d[0], setFilters = _d[1];
    // Dialog states
    var _e = react_1.useState(null), editUser = _e[0], setEditUser = _e[1];
    var _f = react_1.useState(null), journeyUser = _f[0], setJourneyUser = _f[1];
    var _g = react_1.useState(null), passwordUser = _g[0], setPasswordUser = _g[1];
    var _h = react_1.useState(false), showImport = _h[0], setShowImport = _h[1];
    var _j = react_1.useState(false), showRegister = _j[0], setShowRegister = _j[1];
    var _k = react_1.useState(""), searchInput = _k[0], setSearchInput = _k[1];
    var fetchMembers = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var result, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, userService_1.userService.getFilteredUsers(filters)];
                case 2:
                    result = _b.sent();
                    setMembers(result.data);
                    setPagination({
                        page: result.page,
                        totalPages: result.totalPages,
                        total: result.total
                    });
                    return [3 /*break*/, 5];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [filters]);
    react_1.useEffect(function () {
        fetchMembers();
    }, [fetchMembers]);
    react_1.useEffect(function () {
        var timeout = setTimeout(function () {
            setFilters(function (prev) {
                var next = searchInput || undefined;
                if (prev.search === next)
                    return prev;
                return __assign(__assign({}, prev), { search: next, page: 1 });
            });
        }, 300);
        return function () { return clearTimeout(timeout); };
    }, [searchInput]);
    var handleFilterChange = function (key, value) {
        setFilters(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = value === "ALL" ? undefined : value, _a.page = 1, _a)));
        });
    };
    var handleChurchJourneySave = function (id, data) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userService_1.userService.updateChurchJourney(id, data)];
                case 1:
                    _a.sent();
                    fetchMembers();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleEditMemberSave = function (id, data) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userService_1.userService.updateUser(id, data)];
                case 1:
                    _a.sent();
                    fetchMembers();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleSetPassword = function (id, password) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userService_1.userService.setPassword(id, password)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (user) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user.id || !confirm("Delete " + user.firstName + " " + user.lastName + "?"))
                        return [2 /*return*/];
                    return [4 /*yield*/, userService_1.userService.deleteUser(user.id)];
                case 1:
                    _a.sent();
                    fetchMembers();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleSendInvite = function (user) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user.id)
                        return [2 /*return*/];
                    if (!confirm("Send a password-setup invite email to " + user.firstName + " " + user.lastName + " (" + user.email + ")?")) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, userService_1.userService.sendInvite(user.id)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleBulkImport = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userService_1.userService.bulkImport(file)];
                case 1:
                    result = _a.sent();
                    fetchMembers();
                    return [2 /*return*/, result];
            }
        });
    }); };
    var handleRegister = function (payload) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, authService_1.authService.register(payload)];
                case 1:
                    _a.sent();
                    fetchMembers();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleUpdateStatus = function (user, status) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user.id)
                        return [2 /*return*/];
                    if (!confirm("Set " + user.firstName + " " + user.lastName + " to " + status + "?"))
                        return [2 /*return*/];
                    return [4 /*yield*/, userService_1.userService.updateAccountStatus(user.id, status)];
                case 1:
                    _a.sent();
                    fetchMembers();
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "p-4 md:p-6 space-y-6" },
        React.createElement("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between" },
            React.createElement("div", null,
                React.createElement("h1", { className: "text-2xl md:text-3xl font-bold" }, "Members"),
                React.createElement("p", { className: "text-gray-500" },
                    pagination.total,
                    " total members")),
            React.createElement("div", { className: "flex flex-col sm:flex-row gap-2 w-full md:w-auto" },
                React.createElement(button_1.Button, { className: "w-full sm:w-auto", onClick: function () { return setShowRegister(true); } },
                    React.createElement(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }),
                    "Register Member"),
                React.createElement(button_1.Button, { variant: "outline", className: "w-full sm:w-auto", onClick: function () { return setShowImport(true); } },
                    React.createElement(lucide_react_1.Upload, { className: "h-4 w-4 mr-2" }),
                    "Bulk Import"))),
        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" },
            React.createElement("div", { className: "flex-1 sm:col-span-2 min-w- full" },
                React.createElement(input_1.Input, { placeholder: "Search by name or email...", value: searchInput, onChange: function (e) { return setSearchInput(e.target.value); }, className: "pl-9" })),
            React.createElement(select_1.Select, { value: filters.role || "ALL", onValueChange: function (v) { return handleFilterChange("role", v); } },
                React.createElement(select_1.SelectTrigger, { className: "w-full" },
                    React.createElement(select_1.SelectValue, { placeholder: "Role" })),
                React.createElement(select_1.SelectContent, null,
                    React.createElement(select_1.SelectItem, { value: "ALL" }, "All Roles"),
                    React.createElement(select_1.SelectItem, { value: "MEMBER" }, "Member"),
                    React.createElement(select_1.SelectItem, { value: "WORKER" }, "Worker"),
                    React.createElement(select_1.SelectItem, { value: "ADMIN" }, "Admin"))),
            React.createElement(select_1.Select, { value: filters.accountStatus || "ALL", onValueChange: function (v) { return handleFilterChange("accountStatus", v); } },
                React.createElement(select_1.SelectTrigger, { className: "w-full" },
                    React.createElement(select_1.SelectValue, { placeholder: "Status" })),
                React.createElement(select_1.SelectContent, null,
                    React.createElement(select_1.SelectItem, { value: "ALL" }, "All Statuses"),
                    React.createElement(select_1.SelectItem, { value: "ACTIVE" }, "Active"),
                    React.createElement(select_1.SelectItem, { value: "INACTIVE" }, "Inactive"),
                    React.createElement(select_1.SelectItem, { value: "SUSPENDED" }, "Suspended"),
                    React.createElement(select_1.SelectItem, { value: "ARCHIVED" }, "Archived")))),
        loading ? (React.createElement("div", { className: "overflow-x-auto rounded-lg border" }, "Loading members...")) : (React.createElement(MembersTable_1["default"], { data: members, onEdit: function (user) { return setEditUser(user); }, onChurchJourney: function (user) { return setJourneyUser(user); }, onSetPassword: function (user) { return setPasswordUser(user); }, onDelete: handleDelete, onSendInvite: handleSendInvite, onUpdateStatus: handleUpdateStatus })),
        pagination.totalPages > 1 && (React.createElement("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-3" },
            React.createElement(button_1.Button, { className: "w-full sm:w-auto", variant: "outline", size: "sm", disabled: pagination.page <= 1, onClick: function () {
                    return setFilters(function (p) { return (__assign(__assign({}, p), { page: (p.page || 1) - 1 })); });
                } }, "Previous"),
            React.createElement("span", { className: "text-sm text-gray-500" },
                "Page ",
                pagination.page,
                " of ",
                pagination.totalPages),
            React.createElement(button_1.Button, { className: "w-full sm:w-auto", variant: "outline", size: "sm", disabled: pagination.page >= pagination.totalPages, onClick: function () {
                    return setFilters(function (p) { return (__assign(__assign({}, p), { page: (p.page || 1) + 1 })); });
                } }, "Next"))),
        React.createElement(EditMemberDialog_1.EditMemberDialog, { open: !!editUser, onOpenChange: function (open) { return !open && setEditUser(null); }, onSave: handleEditMemberSave, user: editUser }),
        React.createElement(ChurchJourneyDialog_1.ChurchJourneyDialog, { open: !!journeyUser, onOpenChange: function (open) { return !open && setJourneyUser(null); }, user: journeyUser, onSave: handleChurchJourneySave }),
        React.createElement(SetPasswordDialog_1.SetPasswordDialog, { open: !!passwordUser, onOpenChange: function (open) { return !open && setPasswordUser(null); }, user: passwordUser, onSave: handleSetPassword }),
        React.createElement(BulkImportDialog_1.BulkImportDialog, { open: showImport, onOpenChange: setShowImport, onImport: handleBulkImport }),
        React.createElement(RegisterMemberDialog_1.RegisterMemberDialog, { open: showRegister, onOpenChange: setShowRegister, onRegister: handleRegister })));
}
exports["default"] = MembersPage;
