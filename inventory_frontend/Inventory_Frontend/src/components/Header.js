'use client';

import React, { useState } from 'react';
import { Person } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const headerTitle = () => {
    const titles = {
      '/dashboard': 'Dashboard',
      '/Dashboard': 'Dashboard',
      '/branch': 'Branch',
      '/customers': 'Customer Management',
      '/supplier/list': 'Supplier Management',
      '/staff/list': 'Staff Management',
      '/items/addEdit-products': 'Add/Edit Products',
      '/items/products-categories': 'Product Categories',
      '/items/hsn-code': 'HSN Code',
      '/items/batch-tracking': 'Batch Tracking',
      '/stock-management': 'Stock Management',
      '/purchase/purchase-orders': 'Purchase Orders',
      '/purchase/purchase-returns': 'Purchase Returns',
      '/sales': 'Sales',
      '/finance/income': 'Income',
      '/finance/expense': 'Expense',
      '/inventory-costing/weighted-methods': 'Weighted Methods',
      '/inventory-costing/dead-stock': 'Dead Stock',
      '/damage/writeoff': 'Damage Write-off',
      '/Users': 'User Management',
      '/roles-permissions': 'Roles & Permissions',
    };

    if (pathname.startsWith('/roles-permissions/manage')) return 'Manage Permissions';
    return titles[pathname] || 'Inventory Management';
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">{headerTitle()}</h1>
      </div>

      <div className="header-right">
        <div
          className="avatar"
          onClick={() => setIsProfileOpen((prev) => !prev)}
        >
          <Person sx={{ fontSize: 18 }} />
          {isProfileOpen && (
            <div className="avatar-dropdown">
              <Button onClick={handleLogout} className="dropdown-item danger">
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;