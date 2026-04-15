import { fetchWithAuth } from "./api";

// ============ ITEMS ============

function mapApiVariantToForm(v) {
  if (!v) return null;
  const attrs = v.attributes || {};
  return {
    id: v.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    variantType: v.variantName || v.variantType || "",
    variantValue: v.variantName || v.variantType || "",
    skuCode: v.sku || v.skuCode || "",
    purchasePrice: v.discountPrice ?? v.purchasePrice ?? "",
    sellingPrice: v.price ?? v.sellingPrice ?? "",
    stock: v.stock ?? "",
    selectedAttributes: typeof attrs === "object" ? attrs : {},
    batchNumber: v.batchNumber || "",
    serialNumber: v.serialNumber || "",
  };
}

/** Derive attributes list from variant attributes (e.g. { Color: "Red", Size: "L" }) */
function deriveAttributesFromVariants(variants) {
  const map = {};
  for (const v of variants || []) {
    const attrs = v.selectedAttributes || v.attributes;
    if (attrs && typeof attrs === "object") {
      for (const [name, val] of Object.entries(attrs)) {
        if (!name || val == null) continue;
        if (!map[name]) map[name] = new Set();
        map[name].add(String(val));
      }
    }
  }
  return Object.entries(map).map(([attributeName, vals]) => ({
    id: `${attributeName}-${Date.now()}`,
    attributeName,
    attributeValues: Array.from(vals),
  }));
}

export function itemFromApi(data) {
  if (!data) return null;
  const cat = data.category;
  const sub = data.subCategory;
  return {
    id: data._id,
    productId: data._id,
    skuCode: data.SKUcode,
    productName: data.productName,
    productType: data.type,
    category: data.category,
    categoryName: cat?.name || data.categoryName,
    subCategory: data.subCategory,
    subCategoryName: sub?.name || data.subCategoryName,
    brand: data.brand,
    brandName: data.brand,
    unitOfMeasure: data.unitOfMeasure,
    description: data.description,
    barCode: data.Barcode,
    purchasePrice: data.purchasePrice,
    sellingPrice: data.sellingPrice,
    discountType: data.discountType,
    discountValue: data.discount,
    discountPercent: data.discount,
    taxRate: data.taxRate,
    hsnCode: data.hsnCodeString || data.hsnCode?.code || data.hsnCode,
    stock: data.stock,
    reorderLevel: data.reorderPoint ?? data.minStock,
    minStock: data.minStock,
    maxStock: data.maxStock,
    warehouseName: data.warehouseName,
    batchNumber: data.batchNumber,
    serialNumber: data.serialNumber,
    productImageUrl: data.productImageUrl,
    hasVariants: data.hasVariants,
    variants: data.variants,
    status: data.status,
  };
}

/** Convert API item to form data for edit page */
export function itemToFormData(data) {
  if (!data) return null;
  const base = itemFromApi(data);
  const variants = (base.variants || []).map(mapApiVariantToForm).filter(Boolean);
  const attributes = deriveAttributesFromVariants(variants);
  const cat = data.category;
  const sub = data.subCategory;
  const catId = cat?._id || cat?.id || cat;
  const subId = sub?._id || sub?.id || sub;
  return {
    ...base,
    categoryId: catId,
    category: base.categoryName || (typeof cat === "string" ? cat : ""),
    subcategoryId: subId,
    subCategory: base.subCategoryName || (typeof sub === "string" ? sub : ""),
    productCode: data.productCode || base.barCode || "",
    variants,
    attributes,
  };
}

function mapVariantToApi(v) {
  return {
    id: v.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    variantName: v.variantType || v.variantName,
    sku: v.skuCode || v.sku,
    price: Number(v.sellingPrice ?? v.price) || 0,
    discountPrice: Number(v.purchasePrice ?? v.discountPrice) || 0,
    stock: Number(v.stock) || 0,
    batchNumber: v.batchNumber || "",
    serialNumber: v.serialNumber || "",
    attributes: v.selectedAttributes || v.attributes || {},
  };
}

function itemToApi(form) {
  const variants = (form.variants || []).map(mapVariantToApi);
  const barcode = form.barCode || form.Barcode || form.productCode;
  const body = {
    productName: form.productName,
    SKUcode: form.skuCode || form.SKUcode,
    type: form.productType || form.type,
    category: form.categoryId || form.category,
    subCategory: form.subcategoryId || form.subCategory,
    brand: form.brand,
    unitOfMeasure: form.unitOfMeasure || "Pieces",
    description: form.description || "",
    purchasePrice: Number(form.purchasePrice) || 0,
    sellingPrice: Number(form.sellingPrice) || 0,
    discountType: form.discountType,
    discount: Number(form.discountValue ?? form.discount ?? 0) || 0,
    taxRate: Number(form.taxRate) || 0,
    hsnCodeString: form.hsnCode,
    warehouseName: form.warehouseName,
    batchNumber: form.batchNumber,
    serialNumber: form.serialNumber,
    productImageUrl: form.productImageUrl,
    hasVariants: form.hasVariants ?? (variants.length > 0),
    variants,
    stock: Number(form.stock) || 0,
    reorderPoint: Number(form.reorderLevel ?? form.reorderPoint ?? 0) || 0,
    minStock: Number(form.minStock) || 0,
    maxStock: Number(form.maxStock) || 1000,
    status: form.status || "Active",
  };
  if (barcode) body.Barcode = String(barcode).trim();
  if (form.id && form.id !== form._id && form._id) body.id = form.id;
  return body;
}

export async function fetchItems(page = 1, limit = 10) {
  const res = await fetchWithAuth(`/items?page=${page}&limit=${limit}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch items");
  return {
    data: (json.data || []).map((i) => itemFromApi(i)),
    pagination: json.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 }
  };
}

export async function fetchItemById(id) {
  const res = await fetchWithAuth(`/items/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch item");
  return itemFromApi(json.data);
}

export async function fetchItemByIdRaw(id) {
  const res = await fetchWithAuth(`/items/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch item");
  return json.data;
}

export async function createItem(payload) {
  const body = itemToApi(payload);
  const res = await fetchWithAuth("/items", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error creating item");
  return json.data;
}

export async function updateItem(id, payload) {
  const body = itemToApi(payload);
  const res = await fetchWithAuth(`/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error updating item");
  return json.data;
}

export async function deleteItem(id) {
  const res = await fetchWithAuth(`/items/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error deleting item");
  return json;
}

// ============ CATEGORIES ============

export function categoryFromApi(data) {
  if (!data) return null;
  return {
    id: data._id,
    categoryName: data.name,
    name: data.name,
    description: data.description,
    status: data.status || "Active",
  };
}

function categoryToApi(form) {
  return {
    name: form.categoryName || form.name,
    description: form.description || "",
    status: form.status || "Active",
  };
}

export async function fetchCategories() {
  const res = await fetchWithAuth("/categories");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch categories");
  return (json.data || []).map(categoryFromApi);
}

export async function createCategory(payload) {
  const body = categoryToApi(payload);
  const res = await fetchWithAuth("/categories", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error creating category");
  return json.data;
}

export async function updateCategory(id, payload) {
  const body = categoryToApi(payload);
  const res = await fetchWithAuth(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error updating category");
  return json.data;
}

export async function deleteCategory(id) {
  const res = await fetchWithAuth(`/categories/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error deleting category");
  return json;
}

// ============ SUBCATEGORIES ============

export function subcategoryFromApi(data) {
  if (!data) return null;
  return {
    id: data._id,
    categoryId: data.category?._id || data.category,
    subCategoryName: data.name,
    name: data.name,
    description: data.description,
    status: data.status || "Active",
  };
}

function subcategoryToApi(form) {
  return {
    name: form.subCategoryName || form.name,
    description: form.description || "",
    category: form.categoryId || form.category,
    status: form.status || "Active",
  };
}

export async function fetchSubcategories(categoryId) {
  const res = await fetchWithAuth("/subcategories");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch subcategories");
  let list = json.data || [];
  if (categoryId) {
    const catIdStr = String(categoryId);
    list = list.filter((s) => {
      const c = s.category;
      const refId = c && (typeof c === "object" && c !== null && "_id" in c ? c._id : c);
      return refId && String(refId) === catIdStr;
    });
  }
  return list.map((s) => subcategoryFromApi(s));
}

export async function createSubcategory(payload) {
  const body = subcategoryToApi(payload);
  const res = await fetchWithAuth("/subcategories", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error creating subcategory");
  return json.data;
}

export async function updateSubcategory(id, payload) {
  const body = subcategoryToApi(payload);
  const res = await fetchWithAuth(`/subcategories/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error updating subcategory");
  return json.data;
}

export async function deleteSubcategory(id) {
  const res = await fetchWithAuth(`/subcategories/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Error deleting subcategory");
  return json;
}

// ============ HSN/SAC CODES ============

export function hsnFromApi(data) {
  if (!data) return null;
  const cat = data.category;
  const sub = data.subCategory;
  return {
    id: data._id,
    _id: data._id,
    hsnCode: data.code,
    code: data.code,
    description: data.description,
    taxRate: data.taxRate ?? 0,
    category: typeof cat === 'object' && cat?.name ? cat.name : cat,
    categoryId: typeof cat === 'object' && cat?._id ? cat._id : cat,
    subCategory: typeof sub === 'object' && sub?.name ? sub.name : sub,
    subCategoryId: typeof sub === 'object' && sub?._id ? sub._id : sub,
    status: data.status || 'Active',
  };
}

function hsnToApi(form) {
  return {
    code: form.hsnCode || form.code,
    description: form.description || '',
    taxRate: Number(form.taxRate) || 0,
    category: form.categoryId || form.category,
    subCategory: form.subCategoryId || form.subCategory,
  };
}

export async function fetchHsnSacCodes() {
  const res = await fetchWithAuth("/hsn-sac-codes");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch HSN codes");
  return (json.data || []).map(hsnFromApi);
}

export async function createHsnSacCode(payload) {
  const body = hsnToApi(payload);
  const res = await fetchWithAuth("/hsn-sac-codes", { method: "POST", body: JSON.stringify(body) });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create HSN code");
  return hsnFromApi(json.data);
}

export async function updateHsnSacCode(id, payload) {
  const body = hsnToApi(payload);
  const res = await fetchWithAuth(`/hsn-sac-codes/${id}`, { method: "PUT", body: JSON.stringify(body) });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update HSN code");
  return hsnFromApi(json.data);
}

export async function deleteHsnSacCode(id) {
  const res = await fetchWithAuth(`/hsn-sac-codes/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete HSN code");
  return json;
}

// ============ BATCH & SERIAL ============

export function batchFromApi(data) {
  if (!data) return null;
  const item = data.itemId;
  const sup = data.supplier;
  return {
    id: data._id,
    _id: data._id,
    productId: data.itemId?._id || data.itemId,
    productName: item?.productName || item?.name || '-',
    batchNumber: data.batchNumber,
    serialNumber: data.serialNumber,
    quantity: data.totalQuantity ?? data.quantity ?? 0,
    totalQuantity: data.totalQuantity ?? data.quantity ?? 0,
    manufacturingDate: data.purchaseDate ? new Date(data.purchaseDate).toISOString().split('T')[0] : '',
    purchaseDate: data.purchaseDate ? new Date(data.purchaseDate).toISOString().split('T')[0] : '',
    expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : '',
    supplier: typeof sup === 'object' && sup?.name ? sup.name : sup,
    supplierId: typeof sup === 'object' && sup?._id ? sup._id : sup,
    status: data.status || 'Active',
  };
}

function batchToApi(form) {
  return {
    itemId: form.productId || form.itemId,
    batchNumber: form.batchNumber || '',
    serialNumber: form.serialNumber || '',
    totalQuantity: Number(form.quantity ?? form.totalQuantity) || 0,
    purchaseDate: form.manufacturingDate || form.purchaseDate ? new Date(form.manufacturingDate || form.purchaseDate) : undefined,
    expiryDate: form.expiryDate ? new Date(form.expiryDate) : undefined,
    supplier: form.supplierId || form.supplier || undefined,
  };
}

export async function fetchBatchSerialRecords() {
  const res = await fetchWithAuth("/batch-serial");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch batch records");
  return (json.data || []).map(batchFromApi);
}

export async function fetchBatchSerialByItem(itemId) {
  const res = await fetchWithAuth(`/batch-serial/item/${itemId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch batch records");
  return (json.data || []).map(batchFromApi);
}

export async function createBatchSerialRecord(payload) {
  const body = batchToApi(payload);
  const res = await fetchWithAuth("/batch-serial", { method: "POST", body: JSON.stringify(body) });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create batch record");
  return batchFromApi(json.data);
}

export async function updateBatchSerialRecord(id, payload) {
  const body = batchToApi(payload);
  const res = await fetchWithAuth(`/batch-serial/${id}`, { method: "PUT", body: JSON.stringify(body) });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update batch record");
  return batchFromApi(json.data);
}

export async function deleteBatchSerialRecord(id) {
  const res = await fetchWithAuth(`/batch-serial/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete batch record");
  return json;
}
