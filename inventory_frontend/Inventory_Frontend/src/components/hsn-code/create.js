"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

const CreateHSN = ({ onClose, onSave, categories = [], subcategories = [] }) => {
  const [formData, setFormData] = useState({
    hsnCode: "",
    description: "",
    taxRate: "",
    category: "",
    categoryId: "",
    subCategory: "",
    subCategoryId: "",
    status: "Active"
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.hsnCode.trim()) tempErrors.hsnCode = "HSN/SAC Code is required";
    if (formData.taxRate === "" || formData.taxRate < 0) tempErrors.taxRate = "Valid tax rate is required";
    if (!formData.categoryId && !formData.category) tempErrors.category = "Category is required";
    if (!formData.subCategoryId && !formData.subCategory) tempErrors.subCategory = "Subcategory is required";
    if (!formData.description.trim()) tempErrors.description = "Description is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const catList = categories.length > 0 ? categories : [];
  const subList = formData.categoryId
    ? subcategories.filter(s => String(s.categoryId || s.category) === String(formData.categoryId))
    : subcategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: "", category: "", subCategory: "" }));
    if (name === "category" || name === "categoryId") {
      const cat = catList.find(c => c.id === value || c.name === value || (name === "categoryId" ? c.id === value : c.name === value));
      setFormData({
        ...formData,
        [name]: value,
        categoryId: cat?.id || value,
        category: cat?.name || cat?.categoryName || value,
        subCategory: "",
        subCategoryId: ""
      });
    } else if (name === "subCategory" || name === "subCategoryId") {
      const sub = subList.find(s => s.id === value || s.name === value || (name === "subCategoryId" ? s.id === value : s.name === value));
      setFormData({
        ...formData,
        [name]: value,
        subCategoryId: sub?.id || value,
        subCategory: sub?.name || sub?.subCategoryName || value
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = () => {
    if (!validate()) return;
    if (onSave) {
      const payload = { ...formData, categoryId: formData.categoryId || formData.category, subCategoryId: formData.subCategoryId || formData.subCategory };
      onSave(payload);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="HSN/SAC Code *"
          name="hsnCode"
          value={formData.hsnCode}
          onChange={handleChange}
          required
          placeholder="e.g., 8517, 8471"
          error={!!errors.hsnCode}
          helperText={errors.hsnCode}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Tax Rate (%) *"
          name="taxRate"
          type="number"
          value={formData.taxRate}
          onChange={handleChange}
          required
          placeholder="e.g., 18, 12, 0"
          error={!!errors.taxRate}
          helperText={errors.taxRate}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required error={!!errors.category}>
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={formData.categoryId || formData.category}
            onChange={handleChange}
            label="Category"
          >
            {catList.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name || c.categoryName}
              </MenuItem>
            ))}
          </Select>
          {errors.category && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.category}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required error={!!errors.subCategory}>
          <InputLabel>Subcategory</InputLabel>
          <Select
            name="subCategoryId"
            value={formData.subCategoryId || formData.subCategory}
            onChange={handleChange}
            label="Subcategory"
            disabled={!formData.categoryId}
          >
            {subList.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name || s.subCategoryName}
              </MenuItem>
            ))}
          </Select>
          {errors.subCategory && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.subCategory}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Description *"
          name="description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Detailed description of the HSN code"
          error={!!errors.description}
          helperText={errors.description}
        />
      </Grid>
      <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          sx={{ 
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' },
            transform: 'none', 
            textTransform: 'none' 
          }}
        >
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateHSN;