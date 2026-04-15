import { fetchWithAuth, getApiUrl } from "./api";

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return date.toISOString().split("T")[0];
}

export function staffFromApi(data) {
  if (!data) return null;
  const addr = data.address || {};
  const addrStr = [addr.line1, addr.line2, addr.city, addr.state]
    .filter(Boolean)
    .join(", ");
  const statusMap = { Active: "Available", Inactive: "Unavailable", OnLeave: "OnLeave" };
  return {
    id: data._id,
    staffId: data._id,
    staffName: data.name,
    mobileNo: data.phone,
    emailId: data.email,
    joiningDate: formatDate(data.joiningDate),
    availabilityStatus: statusMap[data.status] || data.status || "Available",
    gender: data.gender,
    department: data.department,
    dob: formatDate(data.DOB),
    qualification: data.qualification,
    experience: data.experience,
    branchName: data.branchName,
    designation: data.designation,
    resumeCertificate: data.resumeCertificate,
    qualificationCert: data.highestQualificationCertificate,
    highestQualificationCertificate: data.highestQualificationCertificate,
    panCard: data.panCard,
    aadharCard: data.aadharCard,
    accountHolderName: data.accountHolderName,
    accountNumber: data.accountNumber,
    bankName: data.bankName,
    ifscCode: data.IFSC,
    bankBranch: data.bankBranch,
    branchLocation: data.bankLocation || addr.city,
    salary: data.salary,
    role: data.role,
    permissionRoleId: data.permissionRole?._id || data.permissionRole,
    permissionRoleName: data.permissionRole?.name || null,
    warehouse: data.warehouse,
    status: data.status,
    address: addrStr,
    addressLine1: addr.line1,
    addressLine2: addr.line2,
    city: addr.city,
    district: addr.district,
    pinCode: addr.pinCode,
    state: addr.state,
  };
}

const DOC_FIELDS = ["highestQualificationCertificate", "aadharCard", "panCard", "resumeCertificate"];

function docValue(v) {
  if (v == null || v === "") return undefined;
  if (typeof v === "object" && v instanceof File) return v.name;
  return v;
}

function hasDocumentFiles(payload) {
  return DOC_FIELDS.some((key) => payload[key] instanceof File);
}

function buildStaffFormData(payload) {
  const body = staffToApi(payload);
  const form = new FormData();
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined || value === null) continue;
    if (key === "address") {
      form.append("address", JSON.stringify(value));
    } else {
      form.append(key, value);
    }
  }
  for (const key of DOC_FIELDS) {
    const file = payload[key];
    if (file instanceof File) form.append(key, file);
  }
  return form;
}

export function staffToApi(form) {
  return {
    name: form.staffName,
    DOB: form.dob,
    gender: form.gender,
    qualification: form.qualification,
    experience: form.experience,
    branchName: form.branchName,
    designation: form.designation,
    highestQualificationCertificate: docValue(form.highestQualificationCertificate),
    aadharCard: docValue(form.aadharCard),
    panCard: docValue(form.panCard),
    resumeCertificate: docValue(form.resumeCertificate),
    accountHolderName: form.accountHolderName,
    accountNumber: form.accountNumber || undefined,
    bankName: form.bankName,
    IFSC: form.ifscCode,
    bankBranch: form.bankBranch,
    bankLocation: form.branchLocation,
    email: form.emailId,
    phone: form.mobileNo,
    role: form.role || "Operator",
    permissionRole: form.permissionRoleId || undefined,
    department: form.department,
    warehouse: form.warehouse || form.branchName || "",
    status: form.status || "Active",
    joiningDate: form.joiningDate,
    salary: Number(form.salary) || 0,
    address: {
      line1: form.addressLine1 || form.address || "",
      line2: form.addressLine2 || "",
      city: form.city || "",
      district: form.district || "",
      pinCode: form.pinCode || "",
      state: form.state || "",
    },
  };
}

export async function fetchStaffList(page = 1, limit = 10) {
  const res = await fetchWithAuth(`/staff?page=${page}&limit=${limit}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch staff");
  return {
    data: (json.data || []).map(staffFromApi),
    pagination: json.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 }
  };
}

export async function fetchStaffById(id) {
  const res = await fetchWithAuth(`/staff/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch staff");
  return staffFromApi(json.data);
}

export async function createStaff(payload) {
  if (hasDocumentFiles(payload)) {
    const formData = buildStaffFormData(payload);
    const token =
      typeof window !== "undefined" && localStorage.getItem("inventory_admin_token");
    const res = await fetch(getApiUrl("/staff"), {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to create staff");
    return json.data;
  }
  const body = staffToApi(payload);
  const res = await fetchWithAuth("/staff", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create staff");
  return json.data;
}

export async function updateStaff(id, payload) {
  if (hasDocumentFiles(payload)) {
    const formData = buildStaffFormData(payload);
    const token =
      typeof window !== "undefined" && localStorage.getItem("inventory_admin_token");
    const res = await fetch(getApiUrl(`/staff/${id}`), {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to update staff");
    return json.data;
  }
  const body = staffToApi(payload);
  const res = await fetchWithAuth(`/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update staff");
  return json.data;
}

export async function deleteStaff(id) {
  const res = await fetchWithAuth(`/staff/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete staff");
  return json;
}

export async function fetchWarehouses() {
  const res = await fetchWithAuth("/warehouses");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch warehouses");
  return json.data || [];
}
