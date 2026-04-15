import { fetchWithAuth, getApiUrl } from "./api";

export function customerFromApi(data) {
  if (!data) return null;
  return {
    id: data._id,
    customerId: data._id,
    customerName: data.name,
    email: data.email,
    phone: data.phone,
    companyName: data.companyName,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    gstNumber: data.gstNumber,
    panNumber: data.panNumber,
    creditLimit: data.creditLimit,
    paymentTerms: data.paymentTerms,
    customerType: data.customerType,
    status: data.status,
    totalOrders: data.totalOrders,
    totalAmount: data.totalAmount,
  };
}

export function customerToApi(form) {
  return {
    name: form.customerName,
    email: form.email,
    phone: form.phone,
    companyName: form.companyName || undefined,
    address: form.address || "",
    city: form.city,
    state: form.state,
    pincode: form.pincode || "",
    gstNumber: form.gstNumber || undefined,
    panNumber: form.panNumber || undefined,
    creditLimit: Number(form.creditLimit) || 0,
    paymentTerms: form.paymentTerms || "Net 30",
    customerType: form.customerType || "Retail",
    status: form.status || "Active",
  };
}

export async function fetchCustomers(page = 1, limit = 10) {
  const res = await fetchWithAuth(`/customers?page=${page}&limit=${limit}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch customers");
  return {
    data: (json.data || []).map(customerFromApi),
    pagination: json.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 }
  };
}

export async function fetchCustomerById(id) {
  const res = await fetchWithAuth(`/customers/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch customer");
  return customerFromApi(json.data);
}

export async function createCustomer(payload) {
  const body = customerToApi(payload);
  const res = await fetchWithAuth("/customers", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create customer");
  return json.data;
}

export async function updateCustomer(id, payload) {
  const body = customerToApi(payload);
  const res = await fetchWithAuth(`/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update customer");
  return json.data;
}

export async function deleteCustomer(id) {
  const res = await fetchWithAuth(`/customers/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete customer");
  return json;
}
