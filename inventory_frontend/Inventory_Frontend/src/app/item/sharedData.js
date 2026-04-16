// Shared data module - Re-exports from itemApi for convenience
// All data is now fetched from the backend API

export {
  fetchCategories,
  fetchSubcategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  categoryFromApi,
  subcategoryFromApi
} from '../../../lib/itemApi';

