'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import { ArrowBack, Add, Delete, Edit } from "@mui/icons-material";
import {
  fetchItemByIdRaw,
  updateItem,
  fetchCategories,
  fetchSubcategories,
  fetchHsnSacCodes,
  fetchBatchSerialRecords,
  itemToFormData,
} from '../../../../../lib/itemApi';

const EditProduct = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [hsnCodes, setHsnCodes] = useState([]);
  const [batchOptions, setBatchOptions] = useState({ batchNumbers: [], serialNumbers: [] });

  // HSN Code to Tax Rate mapping (fallback)
  const hsnTaxMapping = {
    '8517': 18, // Mobile phones, smartphones
    '8471': 18, // Laptops, computers
    '9401': 12, // Furniture, chairs
    '6911': 12, // Ceramic items
    '8518': 18, // Audio/video equipment
    '8473': 18, // Computer accessories
    '9403': 12, // Office furniture
    '7323': 18, // Kitchenware, steel items
    '8516': 18, // Electrical equipment
    '8421': 18, // Kitchen appliances
    '8510': 18, // Shaving equipment
    '8516': 18, // Electric heating equipment
    '8517': 18, // Telecommunication equipment
    '8471': 18, // Data processing machines
    '9401': 12, // Seats and furniture
    '6911': 12, // Ceramic tableware
    '7323': 18, // Table, kitchen articles
    '8518': 18, // Microphones, speakers
    '8473': 18, // Parts for computers
    '9403': 12, // Other furniture
  };

  const [formData, setFormData] = useState({
    // Basic Product Details
    productName: "Samsung Galaxy S24",
    category: "Electronics",
    subCategory: "Smartphones",
    brand: "Samsung",
    unitOfMeasure: "Pieces",
    description: "Latest Samsung Galaxy S24 with 128GB storage",
    
    // Pricing Details
    purchasePrice: 42000,
    sellingPrice: 45000,
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 18,
    hsnCode: "8517",
    
    // Stock Details
    stock: 25,
    warehouseName: "Electronics Warehouse",
    batchNumber: "BATCH001",
    serialNumber: "SN001",
    
    // Additional Details
    productImageUrl: "samsung-s24.jpg",
    hasVariants: true,
    variants: [],
    attributes: []
  });

  const [variantForm, setVariantForm] = useState({
    variantType: '',
    variantValue: '',
    skuCode: '',
    purchasePrice: '',
    sellingPrice: '',
    stock: '',
    selectedAttributes: {},
    batchNumber: '',
    serialNumber: ''
  });
  const [variantError, setVariantError] = useState(null);

  const [attributeForm, setAttributeForm] = useState({
    attributeName: '',
    attributeValues: ''
  });

  useEffect(() => {
    let cancelled = false;
    const id = params?.id;
    if (!id) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [item, cats, hsnList, batchList] = await Promise.all([
          fetchItemByIdRaw(id),
          fetchCategories().catch(() => []),
          fetchHsnSacCodes().catch(() => []),
          fetchBatchSerialRecords().catch(() => []),
        ]);
        if (cancelled) return;
        const form = itemToFormData(item);
        if (form) setFormData(form);
        setCategories(cats);
        setHsnCodes(hsnList || []);
        const batches = batchList || [];
        setBatchOptions({
          batchNumbers: [...new Set(batches.map((b) => b.batchNumber).filter(Boolean))],
          serialNumbers: [...new Set(batches.map((b) => b.serialNumber).filter(Boolean))],
        });
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load product');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params?.id]);

  useEffect(() => {
    let cancelled = false;
    const catId = formData.categoryId || categories.find((c) => c.categoryName === formData.category || c.name === formData.category)?.id;
    if (catId) {
      fetchSubcategories(catId).then((subs) => {
        if (!cancelled) setSubcategories(subs);
      }).catch(() => { if (!cancelled) setSubcategories([]); });
    } else setSubcategories([]);
    return () => { cancelled = true; };
  }, [formData.category, formData.categoryId, categories]);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'category' || field === 'categoryId') {
        const cat = categories.find(c => c.id === value || c.categoryName === value || c.name === value);
        if (cat) {
          next.categoryId = cat.id;
          next.category = cat.categoryName || cat.name;
          next.subCategory = '';
          next.subcategoryId = '';
        }
      } else if (field === 'subCategory' || field === 'subcategoryId') {
        const sub = subcategories.find(s => s.id === value || s.subCategoryName === value || s.name === value);
        if (sub) {
          next.subcategoryId = sub.id;
          next.subCategory = sub.subCategoryName || sub.name;
        }
      } else if (field === 'hsnCode' && value) {
        const taxRate = hsnTaxMapping[value] || '';
        if (taxRate) next.taxRate = taxRate;
      } else if (field === 'discountType') next.discountValue = '';
      else if (field === 'discountValue' && value) {
        const numValue = parseFloat(value);
        if (prev.discountType === 'percentage' && numValue > 100) next.discountValue = '100';
        else if (prev.discountType === 'flat' && prev.sellingPrice && numValue > parseFloat(prev.sellingPrice)) next.discountValue = prev.sellingPrice;
      }
      return next;
    });
  };

  const handleVariantInputChange = (field, value) => {
    if (variantError && (field === 'variantType' || field === 'skuCode')) setVariantError(null);
    setVariantForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAttributeInputChange = (field, value) => {
    setAttributeForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVariantAttributeChange = (attributeName, value) => {
    setVariantForm(prev => ({
      ...prev,
      selectedAttributes: {
        ...prev.selectedAttributes,
        [attributeName]: value
      }
    }));
  };

  const addVariant = () => {
    const variantValue = variantForm.variantValue || variantForm.variantType;
    if (!variantForm.variantType || !variantForm.skuCode) {
      setVariantError("Please enter Variant Name and SKU to add a variant");
      return;
    }
    setVariantError(null);
    const newVariant = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      ...variantForm,
      variantValue: variantValue || variantForm.variantType
    };
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
    setVariantForm({
      variantType: '',
      variantValue: '',
      skuCode: '',
      purchasePrice: '',
      sellingPrice: '',
      stock: '',
      selectedAttributes: {},
      batchNumber: '',
      serialNumber: ''
    });
  };

  const removeVariant = (variantId) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== variantId)
    }));
  };

  const editVariant = (variant) => {
    setVariantForm(variant);
    removeVariant(variant.id);
  };

  const addAttribute = () => {
    if (attributeForm.attributeName && attributeForm.attributeValues) {
      const newAttribute = {
        id: Date.now().toString(),
        attributeName: attributeForm.attributeName,
        attributeValues: attributeForm.attributeValues.split(',').map(val => val.trim()).filter(val => val)
      };
      setFormData(prev => ({
        ...prev,
        attributes: [...prev.attributes, newAttribute]
      }));
      setAttributeForm({
        attributeName: '',
        attributeValues: ''
      });
    }
  };

  const removeAttribute = (attributeId) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter(a => a.id !== attributeId)
    }));
  };

  const editAttribute = (attribute) => {
    setAttributeForm({
      attributeName: attribute.attributeName,
      attributeValues: attribute.attributeValues.join(', ')
    });
    removeAttribute(attribute.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = params?.id;
    if (!id) return;
    setError(null);
    setSaving(true);
    try {
      await updateItem(id, formData);
      window.location.href = '/item/all-products';
    } catch (err) {
      setError(err?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const hasAttribute = formData.attributes?.length > 0;
  const hasVariant = formData.variants?.length > 0;
  const shouldSkipValidation = hasAttribute || hasVariant;

  if (loading) {
    return (
      <div className="content-area">
        <Typography color="text.secondary">Loading product...</Typography>
      </div>
    );
  }

  return (
    <div className="content-area">
      {error && (
        <Box sx={{ mb: 2, p: 1.5, bgcolor: "error.light", color: "error.contrastText", borderRadius: 1 }}>
          {error}
        </Box>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          {/* Basic Product Details */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Basic Product Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Product Name *"
                      value={formData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Category *</InputLabel>
                      <Select
                        value={formData.category || ''}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        label="Category *"
                        required
                        displayEmpty
                        MenuProps={{ PaperProps: { sx: { zIndex: 9999 } }, disableScrollLock: true }}
                      >
                        <MenuItem value="">
                          <em>Select category</em>
                        </MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.categoryName || cat.name}>
                            {cat.categoryName || cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Sub Category *</InputLabel>
                      <Select
                        value={formData.subCategory || ''}
                        onChange={(e) => handleInputChange('subCategory', e.target.value)}
                        label="Sub Category *"
                        required
                        disabled={!formData.category}
                        displayEmpty
                        MenuProps={{ PaperProps: { sx: { zIndex: 9999 } }, disableScrollLock: true }}
                      >
                        <MenuItem value="">
                          <em>{subcategories.length === 0 && formData.category ? 'No subcategories' : 'Select subcategory'}</em>
                        </MenuItem>
                        {subcategories.map((sub) => (
                          <MenuItem key={sub.id} value={sub.subCategoryName || sub.name}>
                            {sub.subCategoryName || sub.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Brand *"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Unit of Measure</InputLabel>
                      <Select
                        value={formData.unitOfMeasure}
                        onChange={(e) => handleInputChange('unitOfMeasure', e.target.value)}
                      >
                        <MenuItem value="Pieces">Pieces</MenuItem>
                        <MenuItem value="Kg">Kg</MenuItem>
                        <MenuItem value="Liters">Liters</MenuItem>
                        <MenuItem value="Meters">Meters</MenuItem>
                        <MenuItem value="Box">Box</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label={shouldSkipValidation ? "Description" : "Description *"}
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required={!shouldSkipValidation}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Pricing Details */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Pricing Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label={shouldSkipValidation ? "Purchase Price" : "Purchase Price *"}
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                      required={!shouldSkipValidation}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label={shouldSkipValidation ? "Selling Price" : "Selling Price *"}
                      type="number"
                      value={formData.sellingPrice}
                      onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                      required={!shouldSkipValidation}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Discount Type</InputLabel>
                      <Select
                        value={formData.discountType}
                        onChange={(e) => handleInputChange('discountType', e.target.value)}
                      >
                        <MenuItem value="percentage">Percentage (%)</MenuItem>
                        <MenuItem value="flat">Flat Amount (₹)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label={formData.discountType === 'percentage' ? 'Discount %' : 'Discount Amount (₹)'}
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => handleInputChange('discountValue', e.target.value)}
                      inputProps={{
                        max: formData.discountType === 'percentage' ? 100 : formData.sellingPrice || undefined,
                        min: 0
                      }}
                      helperText={
                        formData.discountType === 'percentage' 
                          ? 'Maximum 100%' 
                          : `Maximum ₹${formData.sellingPrice || 0}`
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>HSN Code</InputLabel>
                      <Select
                        value={formData.hsnCode}
                        onChange={(e) => {
                          const val = e.target.value;
                          const hsn = hsnCodes.find((h) => (h.hsnCode || h.code) === val);
                          handleInputChange('hsnCode', val);
                          if (hsn) handleInputChange('taxRate', hsn.taxRate ?? '');
                        }}
                        label="HSN Code"
                        displayEmpty
                      >
                        <MenuItem value="">Select HSN code</MenuItem>
                        {hsnCodes.map((h) => (
                          <MenuItem key={h.id || h._id} value={h.hsnCode || h.code}>
                            {h.hsnCode || h.code} ({h.taxRate}%)
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Tax Rate %"
                      type="number"
                      value={formData.taxRate}
                      onChange={(e) => handleInputChange('taxRate', e.target.value)}
                      helperText="Auto-calculated based on HSN code"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          backgroundColor: '#f5f5f5',
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Stock Details */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Stock Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label={shouldSkipValidation ? "Stock (optional)" : formData.variants?.length > 0 ? "Stock (optional)" : "Stock *"}
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      required={!shouldSkipValidation && !(formData.variants?.length > 0)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Warehouse Name</InputLabel>
                      <Select
                        value={formData.warehouseName}
                        onChange={(e) => handleInputChange('warehouseName', e.target.value)}
                      >
                        <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
                        <MenuItem value="Electronics Warehouse">Electronics Warehouse</MenuItem>
                        <MenuItem value="Furniture Warehouse">Furniture Warehouse</MenuItem>
                        <MenuItem value="Kitchenware Warehouse">Kitchenware Warehouse</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Batch Number</InputLabel>
                      <Select
                        value={formData.batchNumber}
                        onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                        label="Batch Number"
                        displayEmpty
                      >
                        <MenuItem value="">Select batch</MenuItem>
                        {batchOptions.batchNumbers.map((bn) => (
                          <MenuItem key={bn} value={bn}>{bn}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Serial Number</InputLabel>
                      <Select
                        value={formData.serialNumber}
                        onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                        label="Serial Number"
                        displayEmpty
                      >
                        <MenuItem value="">Select serial</MenuItem>
                        {batchOptions.serialNumbers.map((sn) => (
                          <MenuItem key={sn} value={sn}>{sn}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Attribute Values Section */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: 1, boxShadow: 1 }}>
                <Typography variant="h6" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Attribute Values
                </Typography>
              <Typography variant="body2" sx={{ marginBottom: 3, color: '#666' }}>
                Configure the values for each attribute (e.g., Size: S, M, L)
              </Typography>
              
              {/* Add Attribute Form */}
              <Box sx={{ p: 2, mb: 3, backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Add New Attribute
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label={formData.attributes?.length >= 1 && formData.variants?.length >= 1 ? "Attribute Name" : "Attribute Name *"}
                          value={attributeForm.attributeName}
                          onChange={(e) => handleAttributeInputChange('attributeName', e.target.value)}
                          placeholder="e.g., Size, Color, Storage"
                          required={!(formData.attributes?.length >= 1 && formData.variants?.length >= 1)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label={formData.attributes?.length >= 1 && formData.variants?.length >= 1 ? "Attribute Values" : "Attribute Values *"}
                          value={attributeForm.attributeValues}
                          onChange={(e) => handleAttributeInputChange('attributeValues', e.target.value)}
                          placeholder="e.g., S, M, L or Red, Blue, Green"
                          helperText="Separate multiple values with commas"
                          required={!(formData.attributes?.length >= 1 && formData.variants?.length >= 1)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            type="button"
                            variant="contained"
                            startIcon={<Add />}
                            onClick={addAttribute}
                            sx={{ minWidth: 150 }}
                          >
                            Add Attribute
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Attributes List */}
                  {formData.attributes.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Configured Attributes ({formData.attributes.length})
                      </Typography>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Attribute Name</TableCell>
                            <TableCell>Values</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.attributes.map((attribute) => (
                            <TableRow key={attribute.id}>
                              <TableCell>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {attribute.attributeName}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {attribute.attributeValues.map((value, index) => (
                                    <Chip
                                      key={index}
                                      label={value}
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                    />
                                  ))}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => editAttribute(attribute)}
                                  sx={{ color: '#ff9800', mr: 1 }}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => removeAttribute(attribute.id)}
                                  sx={{ color: '#f44336' }}
                                >
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  )}
              </Box>
            </Grid>

          {/* Product Variants Management */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: 1, boxShadow: 1 }}>
                <Typography variant="h6" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Product Variants Management
                </Typography>
              
              {/* Add Variant Form */}
              <Box sx={{ p: 2, mb: 3, backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    {variantError && (
                      <Box sx={{ mb: 2, p: 1.5, bgcolor: "error.light", color: "error.contrastText", borderRadius: 1 }}>
                        {variantError}
                      </Box>
                    )}
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Add New Variant
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label={formData.attributes?.length >= 1 && formData.variants?.length >= 1 ? "Variant Name" : "Variant Name *"}
                          value={variantForm.variantType}
                          onChange={(e) => handleVariantInputChange('variantType', e.target.value)}
                          placeholder="e.g., iPhone 15 Pro Max 256GB Blue"
                          required={!(formData.attributes?.length >= 1 && formData.variants?.length >= 1)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label={formData.attributes?.length >= 1 && formData.variants?.length >= 1 ? "SKU" : "SKU *"}
                          value={variantForm.skuCode}
                          onChange={(e) => handleVariantInputChange('skuCode', e.target.value)}
                          placeholder="Unique SKU"
                          required={!(formData.attributes?.length >= 1 && formData.variants?.length >= 1)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Stock Quantity"
                          type="number"
                          value={variantForm.stock}
                          onChange={(e) => handleVariantInputChange('stock', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Price (₹)"
                          type="number"
                          value={variantForm.sellingPrice}
                          onChange={(e) => handleVariantInputChange('sellingPrice', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Discount Price (₹)"
                          type="number"
                          value={variantForm.purchasePrice}
                          onChange={(e) => handleVariantInputChange('purchasePrice', e.target.value)}
                        />
                      </Grid>
                      
                      {/* Attributes Selection */}
                      {formData.attributes.length > 0 && (
                        <>
                          <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Attributes
                              </Typography>
                            </Divider>
                          </Grid>
                          {formData.attributes.map((attribute) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={attribute.id}>
                              <FormControl fullWidth>
                                <InputLabel>{attribute.attributeName}</InputLabel>
                                <Select
                                  displayEmpty
                                  value={variantForm.selectedAttributes[attribute.attributeName] || ''}
                                  onChange={(e) => handleVariantAttributeChange(attribute.attributeName, e.target.value)}
                                  label={attribute.attributeName}
                                >
                                  <MenuItem value="">
                                    <em>Select {attribute.attributeName}</em>
                                  </MenuItem>
                                  {attribute.attributeValues.map((value) => (
                                    <MenuItem key={value} value={value}>
                                      {value}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          ))}
                        </>
                      )}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Batch Number"
                          value={variantForm.batchNumber}
                          onChange={(e) => handleVariantInputChange('batchNumber', e.target.value)}
                          placeholder="e.g., BATCH001, B2024001"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Serial Number"
                          value={variantForm.serialNumber}
                          onChange={(e) => handleVariantInputChange('serialNumber', e.target.value)}
                          placeholder="e.g., SN001, SER2024001"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            type="button"
                            variant="contained"
                            startIcon={<Add />}
                            onClick={addVariant}
                            sx={{ minWidth: 150 }}
                          >
                            Add Variant
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Variants List */}
                  {formData.variants.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Added Variants ({formData.variants.length})
                      </Typography>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Variant Name</TableCell>
                            <TableCell>SKU Code</TableCell>
                            <TableCell>Attributes</TableCell>
                            <TableCell>Batch Number</TableCell>
                            <TableCell>Serial Number</TableCell>
                            <TableCell>Price (₹)</TableCell>
                            <TableCell>Discount Price (₹)</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.variants.map((variant) => (
                            <TableRow key={variant.id}>
                              <TableCell>{variant.variantType}</TableCell>
                              <TableCell>{variant.skuCode}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {variant.selectedAttributes && Object.entries(variant.selectedAttributes).map(([key, value]) => (
                                    <Chip
                                      key={key}
                                      label={`${key}: ${value}`}
                                      size="small"
                                      variant="outlined"
                                      color="secondary"
                                    />
                                  ))}
                                </Box>
                              </TableCell>
                              <TableCell>{variant.batchNumber || '-'}</TableCell>
                              <TableCell>{variant.serialNumber || '-'}</TableCell>
                              <TableCell>₹{variant.sellingPrice || 0}</TableCell>
                              <TableCell>₹{variant.purchasePrice || 0}</TableCell>
                              <TableCell>{variant.stock || 0}</TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => editVariant(variant)}
                                  sx={{ color: '#ff9800', mr: 1 }}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => removeVariant(variant.id)}
                                  sx={{ color: '#f44336' }}
                                >
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  )}
              </Box>
            </Grid>

          {/* Action Buttons */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', marginTop: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                sx={{ minWidth: 120 }}
              >
                {saving ? 'Saving...' : 'Update Product'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default EditProduct;
