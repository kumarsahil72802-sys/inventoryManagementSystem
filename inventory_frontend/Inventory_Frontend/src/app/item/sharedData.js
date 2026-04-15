// Shared data for categories and subcategories - managed by their respective modules

// Categories Data - managed by /item/categories page
export let categoriesData = [
  { id: "CAT001", categoryName: "Electronics", description: "Electronic devices and accessories", status: "Active", createdDate: "2024-01-15", lastUpdated: "2024-09-20" },
  { id: "CAT002", categoryName: "Furniture", description: "Office and home furniture", status: "Active", createdDate: "2024-01-16", lastUpdated: "2024-09-21" },
  { id: "CAT003", categoryName: "Kitchenware", description: "Kitchen utensils and appliances", status: "Active", createdDate: "2024-01-17", lastUpdated: "2024-09-22" },
  { id: "CAT004", categoryName: "Clothing", description: "Apparel and accessories", status: "Active", createdDate: "2024-01-18", lastUpdated: "2024-09-23" },
  { id: "CAT005", categoryName: "Books", description: "Books and educational materials", status: "Active", createdDate: "2024-01-19", lastUpdated: "2024-09-24" }
];

// Subcategories Data - managed by /item/subcategories page
export let subcategoriesData = [
  // Electronics Subcategories
  { id: "SUB001", categoryId: "CAT001", subCategoryName: "Smartphones", description: "Mobile phones and accessories", status: "Active", createdDate: "2024-01-15", lastUpdated: "2024-09-20" },
  { id: "SUB002", categoryId: "CAT001", subCategoryName: "Laptops", description: "Portable computers and accessories", status: "Active", createdDate: "2024-01-15", lastUpdated: "2024-09-20" },
  { id: "SUB003", categoryId: "CAT001", subCategoryName: "Tablets", description: "Tablet computers and accessories", status: "Active", createdDate: "2024-01-15", lastUpdated: "2024-09-20" },
  { id: "SUB004", categoryId: "CAT001", subCategoryName: "Accessories", description: "Electronic accessories and peripherals", status: "Active", createdDate: "2024-01-15", lastUpdated: "2024-09-20" },
  
  // Furniture Subcategories
  { id: "SUB005", categoryId: "CAT002", subCategoryName: "Office Chairs", description: "Ergonomic office seating", status: "Active", createdDate: "2024-01-16", lastUpdated: "2024-09-21" },
  { id: "SUB006", categoryId: "CAT002", subCategoryName: "Desks", description: "Office and study desks", status: "Active", createdDate: "2024-01-16", lastUpdated: "2024-09-21" },
  { id: "SUB007", categoryId: "CAT002", subCategoryName: "Storage", description: "Storage solutions and cabinets", status: "Active", createdDate: "2024-01-16", lastUpdated: "2024-09-21" },
  
  // Kitchenware Subcategories
  { id: "SUB008", categoryId: "CAT003", subCategoryName: "Ceramic Items", description: "Ceramic plates, bowls, and utensils", status: "Active", createdDate: "2024-01-17", lastUpdated: "2024-09-22" },
  { id: "SUB009", categoryId: "CAT003", subCategoryName: "Cookware", description: "Pots, pans, and cooking utensils", status: "Active", createdDate: "2024-01-17", lastUpdated: "2024-09-22" },
  
  // Clothing Subcategories
  { id: "SUB010", categoryId: "CAT004", subCategoryName: "Men's Clothing", description: "Men's apparel and accessories", status: "Active", createdDate: "2024-01-18", lastUpdated: "2024-09-23" },
  { id: "SUB011", categoryId: "CAT004", subCategoryName: "Women's Clothing", description: "Women's apparel and accessories", status: "Active", createdDate: "2024-01-18", lastUpdated: "2024-09-23" },
  
  // Books Subcategories
  { id: "SUB012", categoryId: "CAT005", subCategoryName: "Technical Books", description: "Technical and programming books", status: "Active", createdDate: "2024-01-19", lastUpdated: "2024-09-24" },
  { id: "SUB013", categoryId: "CAT005", subCategoryName: "Fiction", description: "Fiction and literature books", status: "Active", createdDate: "2024-01-19", lastUpdated: "2024-09-24" }
];

// Helper Functions
export const getCategories = () => {
  return categoriesData;
};

export const getCategoryById = (id) => {
  return categoriesData.find(category => category.id === id);
};

export const getSubcategories = (categoryId) => {
  return subcategoriesData.filter(sub => sub.categoryId === categoryId);
};

export const getSubcategoryById = (id) => {
  return subcategoriesData.find(subcategory => subcategory.id === id);
};

// CRUD Operations for Categories
export const addCategory = (categoryData) => {
  const newCategory = {
    id: `CAT${String(categoriesData.length + 1).padStart(3, '0')}`,
    ...categoryData,
    createdDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  categoriesData.push(newCategory);
  return newCategory;
};

export const updateCategory = (id, categoryData) => {
  const index = categoriesData.findIndex(category => category.id === id);
  if (index !== -1) {
    categoriesData[index] = {
      ...categoriesData[index],
      ...categoryData,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    return categoriesData[index];
  }
  return null;
};

export const deleteCategory = (id) => {
  const index = categoriesData.findIndex(category => category.id === id);
  if (index !== -1) {
    // Also delete all associated subcategories
    const subcategoryIndices = subcategoriesData
      .map((sub, idx) => sub.categoryId === id ? idx : -1)
      .filter(idx => idx !== -1)
      .reverse(); // Reverse to delete from end to avoid index shifting
    
    subcategoryIndices.forEach(idx => subcategoriesData.splice(idx, 1));
    
    return categoriesData.splice(index, 1)[0];
  }
  return null;
};

// CRUD Operations for Subcategories
export const addSubcategory = (subcategoryData) => {
  const newSubcategory = {
    id: `SUB${String(subcategoriesData.length + 1).padStart(3, '0')}`,
    ...subcategoryData,
    createdDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  subcategoriesData.push(newSubcategory);
  return newSubcategory;
};

export const updateSubcategory = (id, subcategoryData) => {
  const index = subcategoriesData.findIndex(subcategory => subcategory.id === id);
  if (index !== -1) {
    subcategoriesData[index] = {
      ...subcategoriesData[index],
      ...subcategoryData,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    return subcategoriesData[index];
  }
  return null;
};

export const deleteSubcategory = (id) => {
  const index = subcategoriesData.findIndex(subcategory => subcategory.id === id);
  if (index !== -1) {
    return subcategoriesData.splice(index, 1)[0];
  }
  return null;
};

