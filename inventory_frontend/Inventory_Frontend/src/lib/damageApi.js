import { fetchWithAuth } from "./api";

// ============ DAMAGE RECORDS ============

export function damageFromApi(data) {
  if (!data) return null;
  const item = data.itemId;
  const warehouse = data.warehouseId || data.warehouse;
  const reportedBy = data.reportedBy;
  const approvedBy = data.approvedBy;
  
  return {
    id: data._id,
    _id: data._id,
    damageId: data.id || data._id,
    productName: item?.productName || item?.name || data.productName,
    itemId: item?._id || data.itemId,
    skuCode: item?.sku || data.skuCode,
    batchNumber: data.batchNumber,
    damageDate: data.damageDate ? new Date(data.damageDate).toISOString().split('T')[0] : '',
    damageType: data.damageType,
    damageReason: data.damageReason || data.notes,
    damagedQuantity: data.damagedQuantity,
    unitCost: data.unitCost,
    totalLoss: data.totalValue || (data.damagedQuantity * data.unitCost),
    reportedBy: reportedBy?.name || data.reportedBy,
    reportedById: reportedBy?._id,
    approvedBy: approvedBy?.name || data.approvedBy,
    approvedById: approvedBy?._id,
    status: data.status,
    actionTaken: data.resolution?.actionTaken || data.actionTaken,
    warehouseName: warehouse?.name || warehouse?.warehouseName || data.warehouse,
    warehouseId: warehouse?._id || data.warehouse,
    location: warehouse?.location || data.location,
    notes: data.notes,
    priority: data.priority,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function damageToApi(form) {
  return {
    id: form.damageId || form.id,
    productName: form.productName,
    itemId: form.itemId || form.productId,
    damageDate: form.damageDate,
    damageType: form.damageType,
    damagedQuantity: Number(form.damagedQuantity) || 0,
    unitCost: Number(form.unitCost) || 0,
    totalValue: Number(form.totalLoss) || (Number(form.damagedQuantity) * Number(form.unitCost)) || 0,
    reportedBy: form.reportedById || form.reportedBy,
    warehouse: form.warehouseId || form.warehouse,
    status: form.status || 'Pending',
    notes: form.notes || form.damageReason,
    resolution: form.actionTaken ? {
      actionTaken: form.actionTaken,
    } : undefined,
  };
}

export async function fetchDamageRecords(page = 1, limit = 10) {
  const res = await fetchWithAuth(`/damage?page=${page}&limit=${limit}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch damage records");
  return {
    data: (json.data || []).map((d) => damageFromApi(d)),
    pagination: json.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 }
  };
}

export async function fetchDamageRecordById(id) {
  const res = await fetchWithAuth(`/damage/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch damage record");
  return damageFromApi(json.data);
}

export async function fetchDamageRecordsByWarehouse(warehouseId) {
  const res = await fetchWithAuth(`/damage/warehouse/${warehouseId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch damage records");
  return (json.data || []).map(damageFromApi);
}

export async function fetchDamageRecordsByStatus(status) {
  const res = await fetchWithAuth(`/damage/status/${status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch damage records");
  return (json.data || []).map(damageFromApi);
}

export async function createDamageRecord(payload) {
  const body = damageToApi(payload);
  const res = await fetchWithAuth("/damage", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error creating damage record");
  return damageFromApi(json.data);
}

export async function updateDamageRecord(id, payload) {
  const body = damageToApi(payload);
  const res = await fetchWithAuth(`/damage/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error updating damage record");
  return damageFromApi(json.data);
}

export async function deleteDamageRecord(id) {
  const res = await fetchWithAuth(`/damage/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error deleting damage record");
  return json;
}

// ============ DAMAGE RECEIPTS ============

export function receiptFromApi(data) {
  if (!data) return null;
  const damage = data.damageId;
  const item = data.itemId;
  const warehouse = data.warehouseId;
  const createdBy = data.createdBy;
  const reviewedBy = data.reviewedBy;

  return {
    id: data._id,
    _id: data._id,
    receiptNumber: data.receiptNumber,
    damageId: damage?._id || data.damageId,
    damageDetails: damage,
    itemId: item?._id || data.itemId,
    productName: item?.productName || item?.name,
    skuCode: item?.sku,
    warehouseId: warehouse?._id || data.warehouseId,
    warehouseName: warehouse?.name,
    receiptDate: data.receiptDate ? new Date(data.receiptDate).toISOString().split('T')[0] : '',
    damagedQuantity: data.damagedQuantity,
    unitCost: data.unitCost,
    totalValue: data.totalValue,
    damageDescription: data.damageDescription,
    evidence: data.evidence || [],
    witnesses: data.witnesses || [],
    status: data.status,
    receivedBy: createdBy?.name || data.createdBy,
    receivedById: createdBy?._id,
    verifiedBy: reviewedBy?.name || data.reviewedBy,
    verifiedById: reviewedBy?._id,
    reviewedBy: data.reviewedBy,
    reviewedAt: data.reviewedAt,
    notes: data.notes,
    createdBy: data.createdBy,
    createdAt: data.createdAt,
  };
}

function receiptToApi(form) {
  return {
    receiptNumber: form.receiptNumber,
    damageId: form.damageId,
    itemId: form.itemId,
    warehouseId: form.warehouseId,
    receiptDate: form.receiptDate,
    damagedQuantity: Number(form.damagedQuantity) || 0,
    unitCost: Number(form.unitCost) || 0,
    totalValue: Number(form.totalValue) || (Number(form.damagedQuantity) * Number(form.unitCost)) || 0,
    damageDescription: form.damageDescription,
    evidence: form.evidence || [],
    witnesses: form.witnesses || [],
    status: form.status || 'Draft',
    createdBy: form.receivedById || form.createdBy,
    reviewedBy: form.verifiedById || form.reviewedBy,
    notes: form.notes,
  };
}

export async function fetchDamageReceipts(page = 1, limit = 10) {
  const res = await fetchWithAuth(`/damage/receipts?page=${page}&limit=${limit}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch damage receipts");
  return {
    data: (json.data || []).map((r) => receiptFromApi(r)),
    pagination: json.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 }
  };
}

export async function fetchDamageReceiptById(id) {
  const res = await fetchWithAuth(`/damage/receipts/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch damage receipt");
  return receiptFromApi(json.data);
}

export async function createDamageReceipt(payload) {
  const body = receiptToApi(payload);
  const res = await fetchWithAuth("/damage/receipts", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error creating damage receipt");
  return receiptFromApi(json.data);
}

export async function updateDamageReceipt(id, payload) {
  const body = receiptToApi(payload);
  const res = await fetchWithAuth(`/damage/receipts/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error updating damage receipt");
  return receiptFromApi(json.data);
}

export async function deleteDamageReceipt(id) {
  const res = await fetchWithAuth(`/damage/receipts/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error deleting damage receipt");
  return json;
}

// ============ WRITE-OFFS ============

export function writeOffFromApi(data) {
  if (!data) return null;
  const damage = data.damageId;
  const item = data.itemId;
  const warehouse = data.warehouseId;
  const approvedBy = data.approvedBy;
  const createdBy = data.createdBy;
  const completedBy = data.completedBy;

  return {
    id: data._id,
    _id: data._id,
    writeOffNumber: data.writeOffNumber,
    damageId: damage?._id || data.damageId,
    damageDetails: damage,
    itemId: item?._id || data.itemId,
    productName: item?.productName || item?.name,
    skuCode: item?.sku,
    warehouseId: warehouse?._id || data.warehouseId,
    warehouseName: warehouse?.name,
    writeOffDate: data.writeOffDate ? new Date(data.writeOffDate).toISOString().split('T')[0] : '',
    quantity: data.quantity || 0,
    unitCost: data.unitCost || 0,
    totalValue: data.totalValue || 0,
    writeOffReason: data.writeOffReason,
    reasonDescription: data.reasonDescription,
    disposalMethod: data.disposalMethod,
    disposalDetails: data.disposalDetails,
    financialImpact: data.financialImpact,
    recoveryAmount: data.recoveryAmount,
    status: data.status,
    approvedBy: approvedBy?.name || data.approvedBy,
    approvedById: approvedBy?._id,
    approvedAt: data.approvedAt,
    createdBy: createdBy?.name || data.createdBy,
    createdById: createdBy?._id,
    completedBy: completedBy?.name || data.completedBy,
    completedById: completedBy?._id,
    completedAt: data.completedAt,
    notes: data.notes,
    createdAt: data.createdAt,
  };
}

function writeOffToApi(form) {
  return {
    writeOffNumber: form.writeOffNumber,
    damageId: form.damageId,
    itemId: form.itemId,
    warehouseId: form.warehouseId,
    writeOffDate: form.writeOffDate,
    quantity: Number(form.quantity) || 0,
    unitCost: Number(form.unitCost) || 0,
    totalValue: Number(form.totalValue) || (Number(form.quantity) * Number(form.unitCost)) || 0,
    writeOffReason: form.writeOffReason,
    reasonDescription: form.reasonDescription,
    disposalMethod: form.disposalMethod,
    disposalDetails: form.disposalDetails,
    financialImpact: form.financialImpact,
    recoveryAmount: Number(form.recoveryAmount) || 0,
    status: form.status || 'Pending',
    approvedBy: form.approvedById || form.approvedBy,
    createdBy: form.createdById || form.createdBy,
    notes: form.notes,
  };
}

export async function fetchWriteOffs(page = 1, limit = 10) {
  const res = await fetchWithAuth(`/damage/write-offs?page=${page}&limit=${limit}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch write-offs");
  return {
    data: (json.data || []).map((w) => writeOffFromApi(w)),
    pagination: json.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 }
  };
}

export async function fetchWriteOffById(id) {
  const res = await fetchWithAuth(`/damage/write-offs/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch write-off");
  return writeOffFromApi(json.data);
}

export async function createWriteOff(payload) {
  const body = writeOffToApi(payload);
  const res = await fetchWithAuth("/damage/write-offs", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error creating write-off");
  return writeOffFromApi(json.data);
}

export async function updateWriteOff(id, payload) {
  const body = writeOffToApi(payload);
  const res = await fetchWithAuth(`/damage/write-offs/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error updating write-off");
  return writeOffFromApi(json.data);
}

export async function deleteWriteOff(id) {
  const res = await fetchWithAuth(`/damage/write-offs/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error deleting write-off");
  return json;
}
