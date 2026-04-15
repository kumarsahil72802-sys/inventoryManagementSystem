import { fetchWithAuth } from "./api";
import { fetchStaffList } from "./staffApi";

// ================================
// WAREHOUSE (Setup) - uses /warehouses
// ================================

export function warehouseFromApi(data) {
  if (!data) return null;
  const w = typeof data.warehouseId === "object" ? data.warehouseId : data;
  return {
    id: w._id,
    warehouseId: w._id,
    warehouseName: w.name,
    shortCode: w.code,
    address: w.address,
    addressLine1: w.address,
    addressLine2: "",
    location: w.location || w.city,
    city: w.city,
    state: w.state,
    pincode: w.pincode,
    country: w.country || "India",
    contactPerson: w.contactPerson,
    contactPhone: w.contactPersonPhone || w.contactNumber,
    contactEmail: w.contactPersonEmail || w.email,
    warehouseType: w.warehouseType || "Main",
    capacity: w.capacity,
    currentStock: w.currentStock,
    status: w.status === "Maintenance" ? "Under Maintenance" : w.status,
    operatingHours: "24/7",
    establishedDate: w.establishDate || w.establishedDate,
    lastUpdated: w.updatedAt || w.lastUpdated,
  };
}

function warehouseToApi(form) {
  const code = form.shortCode || form.code || `WH${(form.warehouseName || "").slice(0, 3).toUpperCase()}${String(Date.now()).slice(-4)}`;
  return {
    name: form.warehouseName,
    code,
    address: form.address || form.addressLine1 || "",
    location: form.location || form.city,
    city: form.city,
    state: form.state,
    pincode: form.pincode,
    country: form.country || "India",
    contactPerson: form.contactPerson,
    contactPersonPhone: form.phone || form.contactPhone,
    contactPersonEmail: form.email || form.contactEmail,
    contactNumber: form.phone || form.contactPhone,
    warehouseType: form.warehouseType,
    capacity: form.capacity != null && form.capacity !== "" ? Number(form.capacity) : undefined,
    currentStock: form.currentStock != null && form.currentStock !== "" ? Number(form.currentStock) : undefined,
    status: form.status === "Under Maintenance" ? "Maintenance" : form.status || "Active",
    establishDate: form.establishedDate || undefined,
  };
}

export async function fetchWarehouses() {
  const res = await fetchWithAuth("/warehouses");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch warehouses");
  return (json.data || []).map(warehouseFromApi);
}

export async function fetchWarehouseById(id) {
  const res = await fetchWithAuth(`/warehouses/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch warehouse");
  return warehouseFromApi(json.data);
}

export async function createWarehouse(payload) {
  const body = warehouseToApi(payload);
  const res = await fetchWithAuth("/warehouses", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create warehouse");
  return json.data;
}

export async function updateWarehouse(id, payload) {
  const body = warehouseToApi(payload);
  const res = await fetchWithAuth(`/warehouses/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update warehouse");
  return json.data;
}

export async function deleteWarehouse(id) {
  const res = await fetchWithAuth(`/warehouses/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete warehouse");
  return json;
}

// ================================
// BIN / RACK - uses /bin-racks
// ================================

export function binRackFromApi(data) {
  if (!data) return null;
  const wh = data.warehouseId;
  const whName = typeof wh === "object" && wh ? wh.name : "";
  return {
    id: data._id,
    warehouseId: typeof wh === "object" ? wh?._id : wh,
    warehouseName: whName,
    binId: data.binId,
    rackNumber: data.rackNumber,
    binRackNumber: data.rackNumber,
    binType: data.binType,
    zone: data.zone,
    location: data.location,
    productCategory: data.productCategory,
    level: data.level,
    capacity: data.capacity,
    currentStock: data.currentStock ?? 0,
    occupancy: data.currentStock ?? 0,
    binCapacityWeight: data.capacity,
    currentOccupancyWeight: data.currentStock ?? 0,
    status: data.isActive !== false ? "Active" : "Inactive",
    utilization: data.capacity ? Math.round(((data.currentStock ?? 0) / data.capacity) * 100) : 0,
  };
}

function binRackToApi(form, warehouseId) {
  return {
    warehouseId,
    binId: form.binId || form.binRackNumber || `BIN${String(Date.now()).slice(-6)}`,
    rackNumber: form.rackNumber || form.binRackNumber,
    binType: form.binType,
    zone: form.zone,
    location: form.location,
    productCategory: form.productCategory,
    level: form.level || "1",
    capacity: Number(form.capacity),
    currentStock: form.currentStock != null ? Number(form.currentStock) : Number(form.occupancy || 0),
    createdBy: form.createdBy,
  };
}

async function getDefaultCreatedBy() {
  try {
    const staffList = await fetchStaffList();
    const first = staffList?.[0];
    return first?.staffId || first?.id || null;
  } catch {
    return null;
  }
}

export async function fetchBinRacks(warehouseId) {
  const path = warehouseId ? `/bin-racks/warehouse/${warehouseId}` : "/bin-racks";
  const res = await fetchWithAuth(path);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch bin/racks");
  return (json.data || []).map(binRackFromApi);
}

export async function fetchBinRackById(id) {
  const res = await fetchWithAuth(`/bin-racks/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch bin/rack");
  return binRackFromApi(json.data);
}

export async function createBinRack(form, warehouseId) {
  const createdBy = form.createdBy || (await getDefaultCreatedBy());
  const body = binRackToApi({ ...form, createdBy }, warehouseId);
  const res = await fetchWithAuth("/bin-racks", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create bin/rack");
  return json.data;
}

export async function updateBinRack(id, form, warehouseId) {
  const body = { ...binRackToApi(form, warehouseId), createdBy: undefined };
  delete body.createdBy;
  const res = await fetchWithAuth(`/bin-racks/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update bin/rack");
  return json.data;
}

export async function deleteBinRack(id) {
  const res = await fetchWithAuth(`/bin-racks/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete bin/rack");
  return json;
}

// ================================
// WAREHOUSE CAPACITY
// ================================

export function capacityFromApi(data) {
  if (!data) return null;
  const wh = data.warehouseId;
  const whName = typeof wh === "object" && wh ? wh.name : "";
  return {
    id: data._id,
    capacityId: data._id,
    warehouseId: typeof wh === "object" ? wh?._id : wh,
    warehouseName: whName,
    totalZonesInWarehouse: data.totalZonesInWarehouse,
    totalCapacity: data.totalCapacity,
    totalCapacityUnits: data.totalCapacity,
    totalCapacityVolume: data.totalCapacityVolume,
    totalCapacityWeight: data.weightCapacity?.total ?? data.availableCapacityWeight,
    usedCapacity: data.usedCapacity,
    availableCapacityVolume: data.availableCapacityVolume,
    availableCapacityWeight: data.availableCapacityWeight,
    reservedCapacity: data.reservedCapacity ?? 0,
    utilizationPercent: data.utilizationPercent ?? 0,
    throughputCapacity: data.throughputCapacity ?? 0,
    status: data.status || "Good",
    lastUpdated: data.lastUpdated || data.updatedAt,
    zoneData: data.zoneCapacities || [],
  };
}

function capacityToApi(form, warehouseId) {
  const totalVol = Number(form.totalCapacityVolume) || 0;
  const availVol = Number(form.availableCapacityVolume) ?? totalVol;
  const totalWeight = Number(form.totalCapacityWeight) || 0;
  return {
    warehouseId,
    totalZonesInWarehouse: Number(form.totalZonesInWarehouse) || 1,
    totalCapacity: Number(form.totalCapacityUnits || form.totalCapacity) || 0,
    usedCapacity: form.usedCapacity != null ? Number(form.usedCapacity) : 0,
    availableCapacityVolume: availVol,
    availableCapacityWeight: Number(form.availableCapacityWeight) ?? totalWeight,
    totalCapacityVolume: totalVol,
    reservedCapacity: form.reservedCapacity != null ? Number(form.reservedCapacity) : 0,
    utilizationPercent: form.utilizationPercent != null ? Number(form.utilizationPercent) : 0,
    throughputCapacity: Number(form.throughputCapacity || 0),
    status: form.status || "Good",
    createdBy: form.createdBy,
  };
}

export async function fetchWarehouseCapacities(warehouseId) {
  if (warehouseId) {
    const res = await fetchWithAuth(`/warehouse-capacities/warehouse/${warehouseId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to fetch capacity");
    return json.data ? [capacityFromApi(json.data)] : [];
  }
  const res = await fetchWithAuth("/warehouse-capacities");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch capacities");
  return (json.data || []).map(capacityFromApi);
}

export async function fetchWarehouseCapacityById(id) {
  const res = await fetchWithAuth(`/warehouse-capacities/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch capacity");
  return capacityFromApi(json.data);
}

export async function createWarehouseCapacity(form, warehouseId) {
  const createdBy = form.createdBy || (await getDefaultCreatedBy());
  const body = capacityToApi({ ...form, createdBy }, warehouseId);
  const res = await fetchWithAuth("/warehouse-capacities", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create capacity");
  return json.data;
}

export async function updateWarehouseCapacity(id, form, warehouseId) {
  const body = capacityToApi(form, warehouseId);
  delete body.createdBy;
  const res = await fetchWithAuth(`/warehouse-capacities/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update capacity");
  return json.data;
}

export async function deleteWarehouseCapacity(id) {
  const res = await fetchWithAuth(`/warehouse-capacities/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete capacity");
  return json;
}
