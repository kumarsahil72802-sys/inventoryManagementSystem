import {
  DashboardOutlined,
  PeopleOutlined,
  Inventory2Outlined,
  PersonOutlined,
  LocalShippingOutlined,
  WarehouseOutlined,
  InventoryOutlined,
  ShoppingCartOutlined,
  PointOfSaleOutlined,
  AssessmentOutlined,
  ReportProblemOutlined,
  ReceiptOutlined,
  AccountBalanceOutlined,
  AnalyticsOutlined,
  SecurityOutlined,
} from '@mui/icons-material';
import VerticalShadesIcon from '@mui/icons-material/VerticalShades';

const Menuitems = [
  {
    icon: DashboardOutlined,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: PeopleOutlined,
    label: "Staff",
    href: "/staff",
  },
  {
    icon: WarehouseOutlined,
    label: "Warehouse Management",
    href: "/warehouse/setup",
    item: [
      { label: "Multi-Warehouse Setup", href: "/warehouse/setup" },
      { label: "Capacity Planning", href: "/warehouse/capacity" },
      { label: "Bin & Rack Management", href: "/warehouse/bin-rack" },
    ],
  },
  {
    icon: LocalShippingOutlined,
    label: "Supplier",
    href: "/supplier",
  },
  {
    icon: VerticalShadesIcon,
    label: "Branch",
    href: "/branch",
  },
  {
    icon: Inventory2Outlined,
    label: "Item Management",
    href: "/item/all-products",
    item: [
      { label: "All Products", href: "/item/all-products" },
      { label: "Categories", href: "/item/categories" },
      { label: "Subcategories", href: "/item/subcategories" },
      { label: "Batch & Serial Tracking", href: "/item/batch-serial" },
      { label: "HSN/SAC Code Management", href: "/item/hsn-sac" },
    ],
  },
  {
    icon: PersonOutlined,
    label: "Customer",
    href: "/customer",
  },
  {
    icon: InventoryOutlined,
    label: "Stock Management",
    href: "/stock/in-out",
    item: [
      { label: "Stock In/Out", href: "/stock/in-out" },
      { label: "Opening Stock", href: "/stock/opening" },
      { label: "Real-Time Updates", href: "/stock/real-time" },
      { label: "Stock Transfer", href: "/stock/transfer" },
    ],
  },
  {
    icon: ShoppingCartOutlined,
    label: "Purchase Management",
    href: "/purchase/purchase-orders",
    item: [
      { label: "Purchase Orders", href: "/purchase/purchase-orders" },
      { label: "Purchase Returns", href: "/purchase/purchase-returns" },
      { label: "Pending Orders", href: "/purchase/pending-orders" },
      { label: "Cost Price Tracking", href: "/purchase/cost-tracking" },
      { label: "Goods Receipt Note", href: "/purchase/goods-receipt-note" },
    ],
  },
  {
    icon: PointOfSaleOutlined,
    label: "Sales & Order Management",
    href: "/sales/orders",
    item: [
      { label: "Sales Orders", href: "/sales/orders" },
      { label: "Sales Returns", href: "/sales/sales-returns" },
      { label: "Order Tracking", href: "/sales/order-tracking" },
      { label: "Delivery Challans", href: "/sales/delivery-challans" },
    ],
  },
  {
    icon: AssessmentOutlined,
    label: "Inventory Valuation & Costing",
    href: "/valuation/fifo",
    item: [
      { label: "FIFO/LIFO/Weighted Average", href: "/valuation/fifo-lifo-weighted" },
      { label: "Dead Stock Identification", href: "/valuation/dead-stock" },
      { label: "COGS (Cost of Goods Sold)", href: "/valuation/cogs" },
    ],
  },
  {
    icon: ReportProblemOutlined,
    label: "Damage Tracking",
    href: "/damage/write-off",
    item: [
      { label: "Stock Write-Off", href: "/damage/write-off" },
      { label: "Attach Receipts/Bills", href: "/damage/receipts" },
    ],
  },
  {
    icon: ReceiptOutlined,
    label: "Invoice Management",
    href: "/invoices",
  },
  {
    icon: AccountBalanceOutlined,
    label: "Finance",
    href: "/finance/expense",
    item: [
      { label: "Expense", href: "/finance/expense" },
      { label: "Income", href: "/finance/income" },
    ],
  },
  {
    icon: AnalyticsOutlined,
    label: "Reporting & Analytics",
    href: "/reports/summary",
    item: [
      { label: "Stock Summary", href: "/reports/summary" },
      { label: "Item-Wise Sales", href: "/reports/item-sales" },
      { label: "Stock Aging", href: "/reports/stock-aging" },
      { label: "Valuation Report", href: "/reports/valuation" },
    ],
  },
  {
    icon: SecurityOutlined,
    label: "Roles & Permissions",
    href: "/roles-permissions",
  },
];

export default Menuitems;
