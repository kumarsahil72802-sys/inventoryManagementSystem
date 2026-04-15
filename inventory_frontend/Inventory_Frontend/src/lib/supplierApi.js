import { fetchWithAuth, getApiUrl } from "./api";

export function supplierFromApi(data) {
  if (!data) return null;
  return {
    id: data._id,
    supplierId: data._id,
    supplierName: data.name,
    contactPerson: data.contactPerson,
    companyName: data.companyName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    gstNumber: data.gstNumber,
    panNumber: data.panNumber,
    supplierType: data.supplierType,
    creditLimit: data.creditLimit,
    paymentTerms: data.paymentTerms,
    status: data.status,
    rating: data.rating,
    accountHolderName: data.accountHolderName,
    accountNumber: data.accountNumber,
    bankName: data.bankName,
    ifscCode: data.IFSC,
    IFSC: data.IFSC,
    bankBranch: data.bankBranch,
    bankLocation: data.bankLocation,
  };
}

export function supplierToApi(form) {
  return {
    name: form.supplierName,
    contactPerson: form.contactPerson,
    companyName: form.companyName || form.supplierName,
    email: form.email,
    phone: form.phone,
    address: form.address || "",
    city: form.city,
    state: form.state,
    pincode: form.pincode || "",
    gstNumber: form.gstNumber,
    panNumber: form.panNumber || "",
    supplierType: form.supplierType,
    creditLimit: Number(form.creditLimit) || 0,
    paymentTerms: form.paymentTerms || "Net 30",
    status: form.status || "Active",
    rating: form.rating != null ? Number(form.rating) : 3,
    accountHolderName: form.accountHolderName,
    accountNumber: form.accountNumber,
    bankName: form.bankName,
    IFSC: form.ifscCode,
    bankBranch: form.bankBranch,
    bankLocation: form.bankLocation,
  };
}

export async function fetchSuppliers(page = 1, limit = 10) {
  const res = await fetchWithAuth(`/suppliers?page=${page}&limit=${limit}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch suppliers");
  return {
    data: (json.data || []).map(supplierFromApi),
    pagination: json.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 }
  };
}

export async function fetchSupplierById(id) {
  const res = await fetchWithAuth(`/suppliers/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch supplier");
  return supplierFromApi(json.data);
}

export async function createSupplier(payload) {
  const body = supplierToApi(payload);
  const res = await fetchWithAuth("/suppliers", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create supplier");
  return json.data;
}

export async function updateSupplier(id, payload) {
  const body = supplierToApi(payload);
  const res = await fetchWithAuth(`/suppliers/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update supplier");
  return json.data;
}

export async function deleteSupplier(id) {
  const res = await fetchWithAuth(`/suppliers/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete supplier");
  return json;
}
