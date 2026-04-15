'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Edit, ArrowBack } from "@mui/icons-material";

const ViewProduct = () => {
  const params = useParams();
  const [productData, setProductData] = useState({
    id: "PROD001",
    productName: "Samsung Galaxy S24",
    category: "Electronics",
    subCategory: "Smartphones",
    brand: "Samsung",
    unitOfMeasure: "Pieces",
    description: "Latest Samsung Galaxy S24 with 128GB storage",
    barCode: "1234567890123",
    purchasePrice: 42000,
    sellingPrice: 45000,
    discountPercent: 0,
    taxRate: 18,
    hsnCode: "8517",
    warehouseName: "Electronics Warehouse",
    batchNumber: "BATCH001",
    serialNumber: "SN001",
    productImageUrl: "samsung-s24.jpg",
    hasVariants: true,
    variants: [
      {
        id: "VAR001",
        variantName: "Samsung Galaxy S24 128GB Black",
        sku: "SGS24-128GB-BLK",
        price: 45000,
        discountPrice: 42000,
        stock: 15,
        attributes: { Color: "Black", Storage: "128GB" }
      },
      {
        id: "VAR002", 
        variantName: "Samsung Galaxy S24 128GB Blue",
        sku: "SGS24-128GB-BLU",
        price: 45000,
        discountPrice: 42000,
        stock: 10,
        attributes: { Color: "Blue", Storage: "128GB" }
      },
      {
        id: "VAR003",
        variantName: "Samsung Galaxy S24 256GB Black", 
        sku: "SGS24-256GB-BLK",
        price: 50000,
        discountPrice: 47000,
        stock: 8,
        attributes: { Color: "Black", Storage: "256GB" }
      }
    ]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [params.id]);

  const handleEdit = () => {
    window.location.href = `/item/all-products/edit/${params.id}`;
  };

  const handleBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="content-area">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="content-area">
      
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
                  <Typography variant="body2" color="textSecondary">Product Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{productData.productName}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">Category</Typography>
                  <Chip label={productData.category} color="primary" size="small" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">Sub Category</Typography>
                  <Typography variant="body1">{productData.subCategory}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">Brand</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{productData.brand}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">Unit of Measure</Typography>
                  <Typography variant="body1">{productData.unitOfMeasure}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">Bar Code</Typography>
                  <Typography variant="body1">{productData.barCode}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="textSecondary">Description</Typography>
                  <Typography variant="body1">{productData.description}</Typography>
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
                  <Typography variant="body2" color="textSecondary">Purchase Price</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    ₹{productData.purchasePrice.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">Selling Price</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    ₹{productData.sellingPrice.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">Discount %</Typography>
                  <Typography variant="body1">{productData.discountPercent}%</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">Tax Rate %</Typography>
                  <Typography variant="body1">{productData.taxRate}%</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">HSN Code</Typography>
                  <Typography variant="body1">{productData.hsnCode}</Typography>
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
                  <Typography variant="body2" color="textSecondary">Warehouse Name</Typography>
                  <Chip label={productData.warehouseName} color="info" size="small" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">Batch Number</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{productData.batchNumber}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">Serial Number</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{productData.serialNumber}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="textSecondary">Total Stock</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {productData.variants?.reduce((total, variant) => total + variant.stock, 0) || 0} {productData.unitOfMeasure}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Variant Stock Details */}
        {productData.hasVariants && productData.variants && productData.variants.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Variant Stock Details
                </Typography>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Variant Name</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Attributes</TableCell>
                        <TableCell>Price (₹)</TableCell>
                        <TableCell>Discount Price (₹)</TableCell>
                        <TableCell>Stock</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productData.variants.map((variant) => (
                        <TableRow key={variant.id}>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {variant.variantName}
                            </Typography>
                          </TableCell>
                          <TableCell>{variant.sku}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {Object.entries(variant.attributes).map(([key, value]) => (
                                <Chip
                                  key={key}
                                  label={`${key}: ${value}`}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>₹{variant.price.toLocaleString()}</TableCell>
                          <TableCell>₹{variant.discountPrice.toLocaleString()}</TableCell>
                          <TableCell>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 'bold', 
                                color: variant.stock > 0 ? '#2e7d32' : '#d32f2f' 
                              }}
                            >
                              {variant.stock} {productData.unitOfMeasure}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default ViewProduct;

