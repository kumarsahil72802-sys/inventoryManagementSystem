import { fetchWithAuth } from "./api";

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return date.toISOString().split("T")[0];
}

export function branchFromApi(data) {
  if (!data) return null;
  return {
    id: data._id,
    branchCode: data.code,
    branchName: data.name,
    branchType: data.warehouseType || data.branchType,
    managerName: data.managerName || data.contactPerson,
    managerEmail: data.managerEmail || data.contactPersonEmail,
    phone: data.contactNumber,
    alternatePhone: data.alternatePhone,
    email: data.email,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    country: data.country,
    gstNumber: data.gstNumber,
    panNumber: data.panNumber,
    establishedDate: formatDate(data.establishDate || data.establishedDate),
    employeeCount: data.employeeCount,
    area: data.area,
    rentAmount: data.rentAmount,
    status: data.status === "Maintenance" ? "Under Maintenance" : data.status,
  };
}

function branchToApi(form) {
  const location = form.city && form.state ? `${form.city}, ${form.state}` : (form.city || form.state || form.address || "Unknown");
  return {
    name: form.branchName,
    location: location,
    code: form.branchCode,
    warehouseType: form.branchType,
    managerName: form.managerName,
    managerEmail: form.managerEmail,
    contactNumber: form.phone,
    alternatePhone: form.alternatePhone || undefined,
    email: form.email,
    address: form.address || "",
    city: form.city,
    state: form.state,
    pincode: form.pincode || "",
    country: form.country || "India",
    gstNumber: form.gstNumber || undefined,
    panNumber: form.panNumber || undefined,
    establishDate: form.establishedDate || undefined,
    employeeCount: form.employeeCount != null && form.employeeCount !== "" ? Number(form.employeeCount) : undefined,
    area: form.area != null && form.area !== "" ? Number(form.area) : undefined,
    rentAmount: form.rentAmount != null && form.rentAmount !== "" ? Number(form.rentAmount) : undefined,
    status: form.status === "Under Maintenance" ? "Maintenance" : form.status || "Active",
    contactPerson: form.managerName,
    contactPersonEmail: form.managerEmail,
  };
}

export async function fetchBranches() {
  const res = await fetchWithAuth("/warehouses");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch branches");
  return (json.data || []).map(branchFromApi);
}

export async function fetchBranchById(id) {
  const res = await fetchWithAuth(`/warehouses/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch branch");
  return branchFromApi(json.data);
}

export async function createBranch(payload) {
  const body = branchToApi(payload);
  const res = await fetchWithAuth("/warehouses", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create branch");
  return json.data;
}

export async function updateBranch(id, payload) {
  const body = branchToApi(payload);
  const res = await fetchWithAuth(`/warehouses/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update branch");
  return json.data;
}

export async function deleteBranch(id) {
  const res = await fetchWithAuth(`/warehouses/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete branch");
  return json;
}
