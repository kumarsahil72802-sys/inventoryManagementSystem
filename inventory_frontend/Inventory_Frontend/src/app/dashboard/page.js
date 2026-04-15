'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Alert, Table, TableBody,
  TableCell, TableHead, TableRow, Chip, Avatar, IconButton
} from '@mui/material';
import {
  Inventory2Outlined, WarningAmberOutlined, ShoppingCartOutlined,
  TrendingUpOutlined, ReceiptOutlined, AttachMoneyOutlined,
  StoreOutlined, LocalShippingOutlined, ArrowUpward, ArrowDownward,
  RefreshOutlined, InboxOutlined
} from '@mui/icons-material';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { fetchDashboardData } from '@/lib/dashboardApi';

// ==========================================
// 🎨 PREMIUM DESIGN TOKENS
// ==========================================
const T = {
  bg:          '#f8fafc',
  surface:     '#ffffff',
  surfaceAlt:  '#f1f5f9',
  border:      '#e2e8f0',
  borderDark:  '#cbd5e1',

  blue:        '#3b82f6',
  blueLight:   '#eff6ff',
  blueGlow:    'rgba(59, 130, 246, 0.15)',

  indigo:      '#6366f1',
  indigoLight: '#e0e7ff',

  emerald:     '#10b981',
  emeraldLight:'#d1fae5',

  amber:       '#f59e0b',
  amberLight:  '#fef3c7',

  rose:        '#f43f5e',
  roseLight:   '#ffe4e6',

  violet:      '#8b5cf6',
  violetLight: '#ede9fe',

  cyan:        '#06b6d4',
  cyanLight:   '#cffafe',

  teal:        '#14b8a6',
  tealLight:   '#ccfbf1',

  text:        '#0f172a',
  textSub:     '#334155',
  textMuted:   '#64748b',

  shadow:      '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  shadowMd:    '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
  shadowHover: '0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

const PALETTE = [T.blue, T.emerald, T.violet, T.amber, T.cyan, T.rose, T.teal, T.indigo];

// ==========================================
// 🛠 HELPERS
// ==========================================
const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0);

const fmtShort = (v) => {
  if (v >= 10000000) return '₹' + (v / 10000000).toFixed(1) + 'Cr';
  if (v >= 100000)   return '₹' + (v / 100000).toFixed(1) + 'L';
  if (v >= 1000)     return '₹' + (v / 1000).toFixed(0) + 'k';
  return '₹' + v;
};

const monthKey = (d) => {
  const dt = new Date(d);
  return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0');
};

const monthLabel = (k) => {
  const [y, m] = k.split('-');
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1] + ' ' + y.slice(2);
};

// ==========================================
// 🧩 BEAUTIFUL RECHARTS TOOLTIP
// ==========================================
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ 
      bgcolor: 'rgba(15, 23, 42, 0.95)', 
      backdropFilter: 'blur(8px)',
      borderRadius: '12px', 
      p: '12px 16px', 
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)', 
      minWidth: 160,
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <Typography sx={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.color, boxShadow: `0 0 8px ${p.color}` }} />
            <Typography sx={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{p.name}</Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>
            {fmtShort(p.value)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// ==========================================
// 🎨 SLEEK EMPTY STATE
// ==========================================
const EmptyState = ({ message = "No data available in this period" }) => (
  <Box sx={{ 
    display: 'flex', flexDirection: 'column', alignItems: 'center', 
    justifyContent: 'center', height: '100%', py: 4, opacity: 0.8 
  }}>
    <Box sx={{ 
      width: 52, height: 52, borderRadius: '50%', bgcolor: T.surfaceAlt, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
      border: `1px dashed ${T.borderDark}`
    }}>
      <InboxOutlined sx={{ fontSize: 24, color: T.textMuted }} />
    </Box>
    <Typography sx={{ fontSize: 14, fontWeight: 600, color: T.textSub }}>Empty Record</Typography>
    <Typography sx={{ fontSize: 13, color: T.textMuted }}>{message}</Typography>
  </Box>
);

// ==========================================
// 🧩 PREMIUM KPI CARD
// ==========================================
const KpiCard = ({ icon: Icon, label, value, subtitle, color, lightColor, delay = 0 }) => (
  <Box sx={{
    bgcolor: T.surface,
    borderRadius: '20px',
    border: `1px solid ${T.border}`,
    boxShadow: T.shadow,
    p: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
    cursor: 'default',
    animation: `fadeUp 0.6s ease-out forwards`,
    animationDelay: `${delay}ms`,
    opacity: 0,
    transform: 'translateY(20px)',
    '&:hover': {
      boxShadow: T.shadowHover,
      transform: 'translateY(-4px)',
      borderColor: `${color}40`,
      '& .kpi-icon-wrap': { transform: 'scale(1.1) rotate(5deg)' }
    },
    '@keyframes fadeUp': {
      to: { opacity: 1, transform: 'translateY(0)' }
    }
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: T.textMuted, letterSpacing: 1, textTransform: 'uppercase', mb: 1 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: T.text, letterSpacing: -1, lineHeight: 1, mb: 1 }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: T.textMuted, fontWeight: 500 }}>
          {subtitle}
        </Typography>
      </Box>
      <Box className="kpi-icon-wrap" sx={{
        width: 48, height: 48, borderRadius: '14px',
        background: `linear-gradient(135deg, ${lightColor}, ${T.surface})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 8px 16px ${lightColor}`,
        transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
      }}>
        <Icon sx={{ fontSize: 24, color }} />
      </Box>
    </Box>
    <Box sx={{ 
      position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', 
      background: `linear-gradient(90deg, ${color}, transparent)` 
    }} />
  </Box>
);

// ==========================================
// 🧩 SECTION HEADER
// ==========================================
const SecHead = ({ title, sub }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
    <Box>
      <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: T.text, letterSpacing: -0.3 }}>{title}</Typography>
      {sub && <Typography sx={{ fontSize: '0.8rem', color: T.textMuted, mt: 0.3 }}>{sub}</Typography>}
    </Box>
  </Box>
);

// ==========================================
// 🎯 MAIN COMPONENT
// ==========================================
export default function Dashboard() {
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [dateRange, setDateRange]   = useState('90');
  const [warehouse, setWarehouse]   = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const load = () => {
    setRefreshing(true);
    fetchDashboardData()
      .then(setData)
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { load(); }, []);

  // ----------------------------------------
  // LOADING / ERROR
  // ----------------------------------------
  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: T.bg, gap: 3 }}>
      <Box sx={{ 
        width: 64, height: 64, borderRadius: '18px', bgcolor: '#fff', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: T.shadowHover, position: 'relative'
      }}>
        <CircularProgress size={64} thickness={2} sx={{ color: T.blue, position: 'absolute' }} />
        <Inventory2Outlined sx={{ color: T.blue, fontSize: 28 }} />
      </Box>
      <Typography sx={{ color: T.textSub, fontSize: 15, fontWeight: 600, letterSpacing: 0.5 }}>Syncing Dashboard Engine...</Typography>
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 4, bgcolor: T.bg, minHeight: '100vh' }}>
      <Alert severity="error" sx={{ borderRadius: '12px', boxShadow: T.shadow }}>{error}</Alert>
    </Box>
  );

  // ----------------------------------------
  // DATA DERIVATION
  // ----------------------------------------
  const items          = data?.items          || [];
  const lowStock       = data?.lowStockItems  || [];
  const warehouses     = data?.warehouses     || [];
  const salesOrders    = data?.salesOrders    || [];
  const purchaseOrders = data?.purchaseOrders || [];
  const expenses       = data?.expenses       || [];
  const income         = data?.income         || [];

  const days   = parseInt(dateRange, 10) || 90;
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);

  const byDateAndWarehouse = (list) => list.filter((x) => {
    const d = x.orderDate || x.invoiceDate || x.date || x.createdAt;
    const passDate = d ? new Date(d) >= cutoff : true;
    if (warehouse !== 'all' && x.warehouse) {
      const wId = x.warehouse._id || x.warehouse;
      if (wId !== warehouse && wId.toString() !== warehouse) return false;
    }
    return passDate;
  });

  const fSales     = byDateAndWarehouse(salesOrders);
  const fPurchases = byDateAndWarehouse(purchaseOrders);
  const fExpenses  = byDateAndWarehouse(expenses);
  const fIncome    = byDateAndWarehouse(income);

  const totalSales     = fSales.reduce((s, o) => s + (o.totalAmount ?? o.orderTotal ?? 0), 0);
  const totalPurchases = fPurchases.reduce((s, o) => s + (o.totalAmount ?? o.orderTotal ?? 0), 0);
  const totalExpenses  = fExpenses.reduce((s, e) => s + (e.amount ?? 0), 0);
  const totalIncome    = fIncome.reduce((s, i) => s + (i.amount ?? 0), 0);
  const invValue       = items.reduce((s, i) => s + (i.stock ?? i.quantity ?? 0) * (i.purchasePrice ?? i.cost ?? i.sellingPrice ?? 0), 0);

  /* monthly area data */
  const mMap = {};
  fSales.forEach((o) => {
    const k = monthKey(o.orderDate || o.createdAt);
    if (!mMap[k]) mMap[k] = { month: monthLabel(k), sales: 0, purchases: 0, profit: 0 };
    mMap[k].sales += o.totalAmount ?? o.orderTotal ?? 0;
  });
  fPurchases.forEach((o) => {
    const k = monthKey(o.orderDate || o.createdAt);
    if (!mMap[k]) mMap[k] = { month: monthLabel(k), sales: 0, purchases: 0, profit: 0 };
    mMap[k].purchases += o.totalAmount ?? o.orderTotal ?? 0;
  });
  Object.values(mMap).forEach((m) => { m.profit = m.sales - m.purchases; });
  const trendData = Object.values(mMap).sort((a, b) => a.month.localeCompare(b.month));

  /* top products */
  const topProducts = [...items]
    .sort((a, b) => (b.stock ?? 0) * (b.sellingPrice ?? 0) - (a.stock ?? 0) * (a.sellingPrice ?? 0))
    .slice(0, 6)
    .map((i) => ({
      name:  i.productName || i.name || 'Product',
      value: (i.stock ?? 0) * (i.sellingPrice ?? 0) || 0,
      qty:   i.stock ?? 0,
      sku:   i.SKUcode || i.skuCode || '—',
    }));

  /* payments */
  const paymentStatusColors = { Paid: { color: T.emerald }, Partial: { color: T.amber }, Pending: { color: T.rose } };
  const paymentMap = {};
  fSales.forEach((s) => {
    const key = s.paymentStatus || 'Pending';
    paymentMap[key] = (paymentMap[key] || 0) + (s.totalAmount || 0);
  });
  const payments = Object.keys(paymentMap).length > 0
    ? Object.entries(paymentMap).map(([name, value]) => ({ name, value, color: (paymentStatusColors[name] || { color: T.blue }).color }))
    : [];

  /* recent sales */
  const recent = fSales.slice(0, 6).map((s, i) => ({
    id:       s._id || i,
    customer: s.customerName || 'Customer',
    amount:   s.totalAmount  || s.orderTotal || 0,
    date:     s.orderDate    || s.createdAt,
    status:   s.status || s.orderStatus || s.paymentStatus || 'Pending',
  }));

  const STATUS_COLOR = {
    Delivered:  { bg: T.emeraldLight, color: T.emerald  },
    Processing: { bg: T.blueLight,    color: T.blue     },
    Shipped:    { bg: T.cyanLight,    color: T.cyan     },
    Pending:    { bg: T.amberLight,   color: T.amber    },
  };
  const getStatusStyle = (st) => STATUS_COLOR[st] || STATUS_COLOR.Pending;

  /* KPIs */
  const kpis = [
    { icon: ShoppingCartOutlined, label: 'Total Orders',    value: fSales.length,               subtitle: `Last ${days} days`,   color: T.blue,    lightColor: T.blueLight, delay: 0 },
    { icon: TrendingUpOutlined,   label: 'Total Sales',     value: fmt(totalSales),              subtitle: `Last ${days} days`,   color: T.emerald, lightColor: T.emeraldLight, delay: 50 },
    { icon: LocalShippingOutlined,label: 'Purchases',       value: fmt(totalPurchases),          subtitle: `Last ${days} days`,   color: T.violet,  lightColor: T.violetLight, delay: 100 },
    { icon: AttachMoneyOutlined,  label: 'Gross Revenue',   value: fmt(totalIncome),             subtitle: 'All income sources',  color: T.teal,    lightColor: T.tealLight, delay: 150 },
    { icon: ReceiptOutlined,      label: 'Net Profit',      value: fmt(totalIncome - totalExpenses), subtitle: 'After all expenses', color: T.indigo, lightColor: T.indigoLight, delay: 200 },
    { icon: StoreOutlined,        label: 'Inventory Value', value: fmt(invValue),                subtitle: 'Current stock worth', color: T.cyan,    lightColor: T.cyanLight, delay: 250 },
    { icon: Inventory2Outlined,   label: 'Total Products',  value: items.length,                 subtitle: 'Active SKUs',         color: T.amber,   lightColor: T.amberLight, delay: 300 },
    { icon: WarningAmberOutlined, label: 'Low Stock',       value: lowStock.length,              subtitle: 'Needs reorder',       color: T.rose,    lightColor: T.roseLight, delay: 350 },
  ];

  const selectSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: T.surface, borderRadius: '12px', fontSize: 13, height: 42,
      boxShadow: T.shadow,
      '& fieldset': { borderColor: T.border, transition: 'all 0.2s' },
      '&:hover fieldset': { borderColor: T.blueDark },
      '&.Mui-focused fieldset': { borderColor: T.blue, borderWidth: '2px' },
    },
    '& .MuiInputLabel-root': { fontSize: 13, transform: 'translate(14px, 12px) scale(1)' },
    '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled': {
      transform: 'translate(14px, -9px) scale(0.75)'
    }
  };

  // ----------------------------------------
  // RENDER
  // ----------------------------------------
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: T.bg, pb: 8 }}>
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4, maxWidth: 1600, mx: 'auto' }}>

        {/* ── HEADER ── */}
        <Box sx={{ 
          mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          flexWrap: 'wrap', gap: 3,
          animation: 'fadeUp 0.6s ease-out forwards',
        }}>
          <Box>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: T.text, letterSpacing: -0.5, lineHeight: 1.2 }}>
              Executive Dashboard
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', color: T.textMuted, mt: 0.5, fontWeight: 500 }}>
              Live pulse of your entire inventory and sales metrics
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 140, ...selectSx }}>
              <InputLabel>Time Period</InputLabel>
              <Select value={dateRange} label="Time Period" onChange={(e) => setDateRange(e.target.value)}>
                <MenuItem value="7">Last 7 days</MenuItem>
                <MenuItem value="30">Last 30 days</MenuItem>
                <MenuItem value="90">Last 90 days</MenuItem>
                <MenuItem value="365">Last Year</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180, ...selectSx }}>
              <InputLabel>Facility Location</InputLabel>
              <Select value={warehouse} label="Facility Location" onChange={(e) => setWarehouse(e.target.value)}>
                <MenuItem value="all">All Warehouses</MenuItem>
                {warehouses.map((w) => (
                  <MenuItem key={w._id} value={w._id}>{w.name || w.warehouseName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{
              width: 42, height: 42, borderRadius: '12px', bgcolor: T.surface,
              border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', boxShadow: T.shadow,
              '&:hover': { bgcolor: T.blueLight, borderColor: T.blue, color: T.blue },
              transition: 'all 0.2s', color: T.textSub
            }} onClick={load}>
              <RefreshOutlined sx={{ 
                fontSize: 20, 
                animation: refreshing ? 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite' : 'none',
                '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } },
              }} />
            </Box>
          </Box>
        </Box>

        {/* ── KPI GRID ── */}
        <Box sx={{
          display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' },
          gap: 3, mb: 4,
        }}>
          {kpis.map((k, i) => <KpiCard key={i} {...k} />)}
        </Box>

        {/* ── CHARTS ROW 1 ── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1fr 400px' }, gap: 3, mb: 3 }}>
          
          {/* Main Area Chart */}
          <Paper elevation={0} sx={{
            bgcolor: T.surface, borderRadius: '24px', border: `1px solid ${T.border}`,
            boxShadow: T.shadow, p: '28px', 
            animation: 'fadeUp 0.6s ease-out forwards', animationDelay: '400ms', opacity: 0,
          }}>
            <SecHead title="Revenue & Performance" sub="Monthly sales, purchases vs profit breakdown" />
            <Box sx={{ width: '100%', height: 340 }}>
              {trendData.length === 0 ? <EmptyState message="No sales data to graph" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.blue} stopOpacity={0.3} /><stop offset="95%" stopColor={T.blue} stopOpacity={0} /></linearGradient>
                      <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.violet} stopOpacity={0.3} /><stop offset="95%" stopColor={T.violet} stopOpacity={0} /></linearGradient>
                      <linearGradient id="gPr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.emerald} stopOpacity={0.3} /><stop offset="95%" stopColor={T.emerald} stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke={T.border} vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: T.textMuted, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fontSize: 12, fill: T.textMuted, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} dx={-10} />
                    <Tooltip content={<ChartTip />} />
                    <Area dataKey="sales" name="Sales" type="monotone" stroke={T.blue} strokeWidth={3} fill="url(#gS)" activeDot={{ r: 6, strokeWidth: 0, fill: T.blue }} />
                    <Area dataKey="purchases" name="Purchases" type="monotone" stroke={T.violet} strokeWidth={3} fill="url(#gP)" activeDot={{ r: 6, strokeWidth: 0, fill: T.violet }} />
                    <Area dataKey="profit" name="Profit" type="monotone" stroke={T.emerald} strokeWidth={3} fill="url(#gPr)" activeDot={{ r: 6, strokeWidth: 0, fill: T.emerald }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>

          {/* Payment Methods */}
          <Paper elevation={0} sx={{
            bgcolor: T.surface, borderRadius: '24px', border: `1px solid ${T.border}`,
            boxShadow: T.shadow, p: '28px', display: 'flex', flexDirection: 'column',
            animation: 'fadeUp 0.6s ease-out forwards', animationDelay: '500ms', opacity: 0,
          }}>
            <SecHead title="Payment Channels" sub="Cashflow origins by method" />
            <Box sx={{ width: '100%', height: 220, mb: 2 }}>
              {payments.length === 0 ? <EmptyState message="No transactions processed" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={payments} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} stroke="none">
                      {payments.map((p, i) => <Cell key={i} fill={p.color} style={{ filter: `drop-shadow(0px 4px 8px ${p.color}40)` }} />)}
                    </Pie>
                    <Tooltip content={<ChartTip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
            <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {payments.map((p, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '4px', bgcolor: p.color, boxShadow: `0 2px 6px ${p.color}60` }} />
                    <Typography sx={{ fontSize: 14, color: T.textSub, fontWeight: 600 }}>{p.name}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: T.text }}>{fmt(p.value)}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* ── CHARTS ROW 2 ── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr', xl: '400px 1fr 1fr' }, gap: 3 }}>
          
          {/* Top Products */}
          <Paper elevation={0} sx={{
            bgcolor: T.surface, borderRadius: '24px', border: `1px solid ${T.border}`,
            boxShadow: T.shadow, p: '28px',
            animation: 'fadeUp 0.6s ease-out forwards', animationDelay: '600ms', opacity: 0,
          }}>
            <SecHead title="Vault value rank" sub="Most valuable items in stock" />
            {topProducts.length === 0 ? <EmptyState message="Add products to warehouse" /> : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
                {topProducts.slice(0, 5).map((p, i) => {
                  const maxVal = topProducts[0]?.value || 1;
                  const pct = ((p.value / maxVal) * 100);
                  const color = PALETTE[i % PALETTE.length];
                  return (
                    <Box key={i}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: T.text, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 800, color }}>{fmtShort(p.value)}</Typography>
                      </Box>
                      <Box sx={{ height: 8, bgcolor: `${color}15`, borderRadius: 10, overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${color}90, ${color})`, borderRadius: 10, transition: 'width 1.5s cubic-bezier(.4,0,.2,1)' }} />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>

          {/* Recent Orders */}
          <Paper elevation={0} sx={{
            bgcolor: T.surface, borderRadius: '24px', border: `1px solid ${T.border}`,
            boxShadow: T.shadow, p: '28px',
            animation: 'fadeUp 0.6s ease-out forwards', animationDelay: '700ms', opacity: 0,
          }}>
            <SecHead title="Recent Dispatch" sub="Latest completed and processing orders" />
            {recent.length === 0 ? <EmptyState message="No latest orders tracking" /> : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {recent.map((s, i) => {
                  const sc = getStatusStyle(s.status);
                  return (
                    <Box key={s.id} sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      p: 2, borderRadius: '16px', border: `1px solid ${T.border}`,
                      transition: 'all 0.2s', '&:hover': { bgcolor: T.surfaceAlt, borderColor: T.borderDark, transform: 'translateX(4px)' }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: `${PALETTE[i % PALETTE.length]}18`, color: PALETTE[i % PALETTE.length], width: 42, height: 42, fontWeight: 800, borderRadius: '12px' }}>
                          {s.customer.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: 14, fontWeight: 700, color: T.text }}>{s.customer}</Typography>
                          <Typography sx={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>{s.date ? new Date(s.date).toLocaleDateString('en-IN') : '—'}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontSize: 15, fontWeight: 800, color: T.text, mb: 0.5 }}>{fmt(s.amount)}</Typography>
                        <Chip label={s.status} size="small" sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 800, fontSize: 11, height: 22, borderRadius: '6px' }} />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>

          {/* Top Customers */}
          <Paper elevation={0} sx={{
            bgcolor: T.surface, borderRadius: '24px', border: `1px solid ${T.border}`,
            boxShadow: T.shadow, p: '28px',
            animation: 'fadeUp 0.6s ease-out forwards', animationDelay: '800ms', opacity: 0,
          }}>
            <SecHead title="VIP Accounts" sub="Highest converting clients" />
            {(() => {
              const custMap = {};
              salesOrders.forEach((s) => {
                const key = s.customerName || 'Unknown';
                if (!custMap[key]) custMap[key] = { name: key, orders: 0, amount: 0 };
                custMap[key].orders += 1;
                custMap[key].amount += s.totalAmount || 0;
              });
              const topCustomers = Object.values(custMap).sort((a, b) => b.amount - a.amount).slice(0, 5);
              if (topCustomers.length === 0) return <EmptyState message="Customer base is empty" />;
              
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {topCustomers.map((c, i) => (
                    <Box key={i} sx={{
                      display: 'flex', alignItems: 'center', gap: 2, p: 2,
                      borderRadius: '16px', bgcolor: i === 0 ? T.amberLight : T.surface,
                      border: `1px solid ${i === 0 ? T.amber + '40' : T.border}`,
                    }}>
                      <Box sx={{
                        width: 32, height: 32, borderRadius: '10px', flexShrink: 0,
                        bgcolor: i === 0 ? T.amber : T.surfaceAlt,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 800, color: i === 0 ? '#fff' : T.textMuted,
                        boxShadow: i === 0 ? `0 4px 10px ${T.amber}60` : 'none'
                      }}>#{i + 1}</Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: i === 0 ? '#b45309' : T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: i === 0 ? '#d97706' : T.textMuted, fontWeight: 600 }}>{c.orders} Orders</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 15, fontWeight: 800, color: i === 0 ? '#b45309' : T.text }}>{fmt(c.amount)}</Typography>
                    </Box>
                  ))}
                </Box>
              );
            })()}
          </Paper>

        </Box>
      </Box>
    </Box>
  );
}