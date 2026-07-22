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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.EditMemberDialog = void 0;
var react_1 = require("react");
var dialog_1 = require("@/components/ui/dialog");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
var departmentService_1 = require("@/services/departmentService");
var userService_1 = require("@/services/userService");
var emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    address: "",
    dateOfBirth: "",
    matricNumber: "",
    department: "",
    level: "",
    faculty: "",
    role: "",
    churchStatus: "",
    membershipType: "",
    workerType: "",
    departmentIds: [],
    headDepartmentIds: [],
    assistantDepartmentIds: []
};
var toDateInput = function (v) {
    if (!v)
        return "";
    var d = new Date(v);
    if (Number.isNaN(d.getTime()))
        return "";
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
var seedForm = function (user, allDepartments) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    if (!user)
        return emptyForm;
    // Some lists serve a member without the full M2M arrays. Fall back to empty.
    var pickIds = function (rel) { var _a; return (_a = rel === null || rel === void 0 ? void 0 : rel.map(function (d) { return d.id; }).filter(function (id) { return allDepartments.some(function (dep) { return dep.id === id; }); })) !== null && _a !== void 0 ? _a : []; };
    return {
        firstName: (_a = user.firstName) !== null && _a !== void 0 ? _a : "",
        lastName: (_b = user.lastName) !== null && _b !== void 0 ? _b : "",
        email: (_c = user.email) !== null && _c !== void 0 ? _c : "",
        phoneNumber: (_d = user.phoneNumber) !== null && _d !== void 0 ? _d : "",
        gender: (_e = user.gender) !== null && _e !== void 0 ? _e : "",
        address: (_f = user.address) !== null && _f !== void 0 ? _f : "",
        dateOfBirth: toDateInput(user.dateOfBirth),
        matricNumber: (_g = user.matricNumber) !== null && _g !== void 0 ? _g : "",
        department: (_h = user.department) !== null && _h !== void 0 ? _h : "",
        level: (_j = user.level) !== null && _j !== void 0 ? _j : "",
        faculty: (_k = user.faculty) !== null && _k !== void 0 ? _k : "",
        role: (_l = user.role) !== null && _l !== void 0 ? _l : "",
        churchStatus: (_m = user.churchStatus) !== null && _m !== void 0 ? _m : "",
        membershipType: (_o = user.membershipType) !== null && _o !== void 0 ? _o : "",
        workerType: (_p = user.workerType) !== null && _p !== void 0 ? _p : "",
        departmentIds: pickIds(user.departments),
        headDepartmentIds: pickIds(user.headedDepartments),
        assistantDepartmentIds: pickIds(user.assistantDepartments)
    };
};
function DeptPicker(_a) {
    var label = _a.label, hint = _a.hint, options = _a.options, value = _a.value, onChange = _a.onChange;
    var _b = react_1.useState(""), search = _b[0], setSearch = _b[1];
    var filtered = react_1.useMemo(function () {
        return options.filter(function (d) {
            return d.name.toLowerCase().includes(search.toLowerCase());
        });
    }, [options, search]);
    var toggle = function (id) {
        if (value.includes(id))
            onChange(value.filter(function (v) { return v !== id; }));
        else
            onChange(__spreadArrays(value, [id]));
    };
    var selectedDepts = react_1.useMemo(function () { return options.filter(function (d) { return value.includes(d.id); }); }, [options, value]);
    return (React.createElement("div", { className: "space-y-2" },
        React.createElement(label_1.Label, null, label),
        hint && React.createElement("p", { className: "text-xs text-gray-500" }, hint),
        selectedDepts.length > 0 && (React.createElement("div", { className: "flex flex-wrap gap-1.5" }, selectedDepts.map(function (d) { return (React.createElement("span", { key: d.id, className: "inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200" },
            d.name,
            React.createElement("button", { type: "button", onClick: function () { return toggle(d.id); }, className: "hover:text-red-500", "aria-label": "Remove " + d.name },
                React.createElement(lucide_react_1.X, { className: "h-3 w-3" })))); }))),
        React.createElement("div", { className: "relative" },
            React.createElement(lucide_react_1.Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }),
            React.createElement(input_1.Input, { placeholder: "Search departments...", className: "pl-9", value: search, onChange: function (e) { return setSearch(e.target.value); } })),
        React.createElement("div", { className: "border rounded-lg max-h-[140px] overflow-y-auto divide-y" }, filtered.length === 0 ? (React.createElement("p", { className: "text-xs text-gray-400 text-center py-3" }, "No departments match")) : (filtered.map(function (d) {
            var checked = value.includes(d.id);
            return (React.createElement("label", { key: d.id, className: "flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm" },
                React.createElement("input", { type: "checkbox", checked: checked, onChange: function () { return toggle(d.id); }, className: "h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" }),
                React.createElement("span", null, d.name)));
        })))));
}
// ----- Main dialog -----
function EditMemberDialog(_a) {
    var _this = this;
    var open = _a.open, onOpenChange = _a.onOpenChange, onSave = _a.onSave;
    var _b = react_1.useState(null), user = _b[0], setUser = _b[1];
    var _c = react_1.useState(emptyForm), form = _c[0], setForm = _c[1];
    var _d = react_1.useState([]), departments = _d[0], setDepartments = _d[1];
    var _e = react_1.useState(false), saving = _e[0], setSaving = _e[1];
    react_1.useEffect(function () {
        if (!open)
            return;
        console.log("Fetching user and departments for EditMemberDialog", user);
        userService_1.userService
            .getUserById((user === null || user === void 0 ? void 0 : user.id) || "")
            .then(function (res) { return setUser(res !== null && res !== void 0 ? res : null); })["catch"](function () { return setUser(null); });
        departmentService_1.departmentService
            .getAllDepartments({ page: 1, limit: 100 })
            .then(function (res) { var _a; return setDepartments((_a = res.data) !== null && _a !== void 0 ? _a : []); })["catch"](function () { return setDepartments([]); });
    }, [open]);
    react_1.useEffect(function () {
        setForm(seedForm(user, departments));
    }, [user, open, departments]);
    var setField = function (key, value) {
        return setForm(function (f) {
            var _a;
            return (__assign(__assign({}, f), (_a = {}, _a[key] = value, _a)));
        });
    };
    var handleSave = function () { return __awaiter(_this, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(user === null || user === void 0 ? void 0 : user.id))
                        return [2 /*return*/];
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    payload = {
                        firstName: form.firstName.trim() || undefined,
                        lastName: form.lastName.trim() || undefined,
                        email: form.email.trim() || undefined,
                        phoneNumber: form.phoneNumber.trim() || undefined,
                        gender: form.gender || undefined,
                        address: form.address.trim() || undefined,
                        dateOfBirth: form.dateOfBirth
                            ? new Date(form.dateOfBirth).toISOString()
                            : undefined,
                        matricNumber: form.matricNumber.trim() || undefined,
                        department: form.department.trim() || undefined,
                        level: form.level.trim() || undefined,
                        faculty: form.faculty.trim() || undefined,
                        role: form.role || undefined,
                        churchStatus: form.churchStatus || undefined,
                        membershipType: form.membershipType || undefined,
                        workerType: form.membershipType === "WORKER"
                            ? form.workerType || undefined
                            : undefined,
                        // Always send arrays — empty array means "no departments" and clears the M2M.
                        departmentIds: form.departmentIds,
                        headDepartmentIds: form.headDepartmentIds,
                        assistantDepartmentIds: form.assistantDepartmentIds
                    };
                    return [4 /*yield*/, onSave(user.id, payload)];
                case 2:
                    _a.sent();
                    onOpenChange(false);
                    return [3 /*break*/, 4];
                case 3:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(dialog_1.Dialog, { open: open, onOpenChange: onOpenChange },
        React.createElement(dialog_1.DialogContent, { className: "sm:max-w-2xl max-h-[85vh] overflow-y-auto" },
            React.createElement(dialog_1.DialogHeader, null,
                React.createElement(dialog_1.DialogTitle, null,
                    "Edit Member",
                    user && (React.createElement("span", { className: "block text-sm font-normal text-gray-500 mt-1" },
                        user.firstName,
                        " ",
                        user.lastName)))),
            React.createElement("div", { className: "space-y-6 py-2" },
                React.createElement("section", { className: "space-y-3" },
                    React.createElement("h3", { className: "text-sm font-semibold text-gray-700" }, "Profile"),
                    React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "First Name"),
                            React.createElement(input_1.Input, { value: form.firstName, onChange: function (e) { return setField("firstName", e.target.value); } })),
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Last Name"),
                            React.createElement(input_1.Input, { value: form.lastName, onChange: function (e) { return setField("lastName", e.target.value); } })),
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Email"),
                            React.createElement(input_1.Input, { type: "email", value: form.email, onChange: function (e) { return setField("email", e.target.value); } })),
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Phone Number"),
                            React.createElement(input_1.Input, { value: form.phoneNumber, onChange: function (e) { return setField("phoneNumber", e.target.value); } })),
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Gender"),
                            React.createElement(select_1.Select, { value: form.gender || "", onValueChange: function (v) { return setField("gender", v); } },
                                React.createElement(select_1.SelectTrigger, null,
                                    React.createElement(select_1.SelectValue, { placeholder: "Select gender" })),
                                React.createElement(select_1.SelectContent, null,
                                    React.createElement(select_1.SelectItem, { value: "MALE" }, "Male"),
                                    React.createElement(select_1.SelectItem, { value: "FEMALE" }, "Female")))),
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Date of Birth"),
                            React.createElement(input_1.Input, { type: "date", value: form.dateOfBirth, onChange: function (e) { return setField("dateOfBirth", e.target.value); } })),
                        React.createElement("div", { className: "col-span-2 space-y-1.5" },
                            React.createElement(label_1.Label, null, "Address"),
                            React.createElement(input_1.Input, { value: form.address, onChange: function (e) { return setField("address", e.target.value); } })),
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Matric Number"),
                            React.createElement(input_1.Input, { value: form.matricNumber, onChange: function (e) { return setField("matricNumber", e.target.value); } })),
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Department (free-text)"),
                            React.createElement(input_1.Input, { value: form.department, onChange: function (e) { return setField("department", e.target.value); } })),
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Level"),
                            React.createElement(input_1.Input, { value: form.level, onChange: function (e) { return setField("level", e.target.value); } })),
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Faculty"),
                            React.createElement(input_1.Input, { value: form.faculty, onChange: function (e) { return setField("faculty", e.target.value); } })))),
                React.createElement("section", { className: "space-y-3 border-t pt-4" },
                    React.createElement("h3", { className: "text-sm font-semibold text-gray-700" }, "Role & Journey"),
                    React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Role"),
                            React.createElement(select_1.Select, { value: form.role || "", onValueChange: function (v) { return setField("role", v); } },
                                React.createElement(select_1.SelectTrigger, null,
                                    React.createElement(select_1.SelectValue, { placeholder: "Select role" })),
                                React.createElement(select_1.SelectContent, null,
                                    React.createElement(select_1.SelectItem, { value: "MEMBER" }, "Member"),
                                    React.createElement(select_1.SelectItem, { value: "WORKER" }, "Worker"),
                                    React.createElement(select_1.SelectItem, { value: "ADMIN" }, "Admin")))),
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Church Status"),
                            React.createElement(select_1.Select, { value: form.churchStatus || "", onValueChange: function (v) {
                                    return setField("churchStatus", v);
                                } },
                                React.createElement(select_1.SelectTrigger, null,
                                    React.createElement(select_1.SelectValue, { placeholder: "Select status" })),
                                React.createElement(select_1.SelectContent, null,
                                    React.createElement(select_1.SelectItem, { value: "FIRST_TIMER" }, "First Timer"),
                                    React.createElement(select_1.SelectItem, { value: "VISITOR" }, "Visitor"),
                                    React.createElement(select_1.SelectItem, { value: "MEMBER" }, "Member")))),
                        React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Membership Type"),
                            React.createElement(select_1.Select, { value: form.membershipType || "", onValueChange: function (v) {
                                    return setField("membershipType", v);
                                } },
                                React.createElement(select_1.SelectTrigger, null,
                                    React.createElement(select_1.SelectValue, { placeholder: "Select type" })),
                                React.createElement(select_1.SelectContent, null,
                                    React.createElement(select_1.SelectItem, { value: "NON_WORKER" }, "Non-worker"),
                                    React.createElement(select_1.SelectItem, { value: "WORKER" }, "Worker")))),
                        form.membershipType === "WORKER" && (React.createElement("div", { className: "space-y-1.5" },
                            React.createElement(label_1.Label, null, "Worker Type"),
                            React.createElement(select_1.Select, { value: form.workerType || "", onValueChange: function (v) {
                                    return setField("workerType", v);
                                } },
                                React.createElement(select_1.SelectTrigger, null,
                                    React.createElement(select_1.SelectValue, { placeholder: "Select worker type" })),
                                React.createElement(select_1.SelectContent, null,
                                    React.createElement(select_1.SelectItem, { value: "REGULAR" }, "Regular"),
                                    React.createElement(select_1.SelectItem, { value: "EXECUTIVE" }, "Executive"))))))),
                React.createElement("section", { className: "space-y-4 border-t pt-4" },
                    React.createElement("h3", { className: "text-sm font-semibold text-gray-700" }, "Departments"),
                    React.createElement(DeptPicker, { label: "Member of", hint: "Departments this user belongs to.", options: departments, value: form.departmentIds, onChange: function (next) { return setField("departmentIds", next); } }),
                    React.createElement(DeptPicker, { label: "Heads", hint: "Departments this user heads.", options: departments, value: form.headDepartmentIds, onChange: function (next) { return setField("headDepartmentIds", next); } }),
                    React.createElement(DeptPicker, { label: "Assists in", hint: "Departments where this user serves as an assistant head.", options: departments, value: form.assistantDepartmentIds, onChange: function (next) { return setField("assistantDepartmentIds", next); } }))),
            React.createElement(dialog_1.DialogFooter, { className: "border-t pt-3" },
                React.createElement(button_1.Button, { variant: "outline", onClick: function () { return onOpenChange(false); }, disabled: saving }, "Cancel"),
                React.createElement(button_1.Button, { onClick: handleSave, disabled: saving }, saving ? "Saving..." : "Save Changes")))));
}
exports.EditMemberDialog = EditMemberDialog;
