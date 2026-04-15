# Inventory Management System

A comprehensive full-stack inventory management system built with modern web technologies. This application provides complete inventory tracking, sales management, purchase orders, financial reporting, and administrative controls.

## 🏗️ Project Overview

This is a production-ready inventory management system designed for businesses to efficiently track their inventory, manage sales and purchases, handle financial operations, and generate insightful reports.

### Key Features

#### ✅ **Completed Features**
- **Admin Authentication**: Secure login system with JWT tokens
- **Executive Dashboard**: Real-time KPIs and analytics (Total Orders, Sales, Purchases, Revenue, Profit)
- **Staff Management**: Full CRUD operations with document uploads to Cloudinary
- **Category Management**: Complete item categorization system
- **Supplier Management**: Supplier database with full CRUD operations
- **Customer Management**: Customer relationship management
- **Branch/Warehouse Management**: Multi-location inventory support
- **Stock Management**: Real-time stock tracking with API integration
- **Sales Orders**: Complete sales order management with API backend
- **Purchase Orders**: Complete purchase order management with API backend
- **Basic Reporting**: Dynamic dashboard charts and summaries

#### 🚧 **In Progress / Pending Features**
- **Invoices**: Backend API exists, frontend needs API integration
- **Finance Management**: Backend API exists, frontend needs API integration
- **Real-time Stock Deductions**: ✅ **COMPLETED** - Automated stock updates on sales/purchases
- **Advanced Reporting**: Valuation reports, stock aging, item-wise sales
- **Damage Tracking**: Damage records and write-offs
- **Batch & Serial Tracking**: Advanced inventory tracking features

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **File Storage**: Cloudinary for document uploads
- **Security**: CORS, input validation, authentication middleware

### Frontend
- **Framework**: Next.js 15 with React 19
- **UI Library**: Material-UI (MUI) components
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios for API communication
- **Charts**: Recharts for data visualization

### Development Tools
- **Version Control**: Git
- **Package Management**: npm
- **Code Quality**: ESLint
- **API Testing**: Postman/Thunder Client

## 📁 Project Structure

```
inventory_management/
├── audit_report.md                 # Project audit and status report
├── inventory_backend/
│   └── Inventory_Backend/
│       ├── index.js               # Main server file
│       ├── package.json           # Backend dependencies
│       ├── src/
│       │   ├── config/            # Database and external service configs
│       │   ├── controllers/       # Business logic controllers
│       │   ├── middleware/        # Authentication & validation middleware
│       │   ├── models/            # MongoDB schemas
│       │   ├── routes/            # API route definitions
│       │   └── utils/             # Helper functions
│       └── README.md
└── inventory_frontend/
    └── Inventory_Frontend/
        ├── package.json           # Frontend dependencies
        ├── next.config.mjs        # Next.js configuration
        ├── src/
        │   ├── app/               # Next.js app router pages
        │   ├── components/        # Reusable UI components
        │   ├── context/           # React context providers
        │   └── lib/               # API clients and utilities
        └── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd inventory_backend/Inventory_Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend root:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/inventory_db
   JWT_SECRET=your_super_secret_jwt_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```
   Server will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd inventory_frontend/Inventory_Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env.local` file in the frontend root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:3000`

### Database Setup

1. **MongoDB Connection:**
   - Ensure MongoDB is running locally or use a cloud service like MongoDB Atlas
   - Update the `MONGODB_URI` in backend `.env` file

2. **Initial Admin User:**
   The system includes a script to create an initial admin user. Run:
   ```bash
   node reset_admin.js
   ```

## 🔧 API Architecture

### Centralized API Client
The application uses a centralized axios-based API client for all HTTP requests:

- **Location**: `src/lib/api.js`
- **Features**:
  - Axios instance with baseURL from environment variables
  - Automatic JWT token injection via request interceptors
  - Consistent error handling
  - Backward compatibility with existing fetch-based functions

### API Modules
Individual API modules import the centralized client:
```javascript
import { apiClient } from './api';

// Usage
export const getData = async () => {
  const response = await apiClient.get('/endpoint');
  return response.data;
};
```

### Environment Configuration
- **Environment Variable**: `NEXT_PUBLIC_API_URL`
- **Default**: `http://localhost:8000/api`
- **Configuration**: Set in `.env.local` for development

## 📡 API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login

### Staff Management
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Create new staff
- `GET /api/staff/:id` - Get staff by ID
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff

### Stock Management
- `GET /api/stock/real-time` - Get real-time stock data
- `GET /api/stock/transactions` - Get stock transactions
- `POST /api/stock/transactions` - Create stock transaction

### Sales Management
- `GET /api/sales/orders` - Get all sales orders
- `POST /api/sales/orders` - Create sales order
- `GET /api/sales/orders/:id` - Get sales order by ID
- `PUT /api/sales/orders/:id` - Update sales order
- `DELETE /api/sales/orders/:id` - Delete sales order

### Purchase Management
- `GET /api/purchase/orders` - Get all purchase orders
- `POST /api/purchase/orders` - Create purchase order
- `GET /api/purchase/orders/:id` - Get purchase order by ID
- `PUT /api/purchase/orders/:id` - Update purchase order
- `DELETE /api/purchase/orders/:id` - Delete purchase order

### Dashboard
- `GET /api/dashboard` - Get dashboard analytics

## 🔧 Development Guidelines

### Code Style
- Use ESLint configuration for consistent code formatting
- Follow React best practices and hooks guidelines
- Use meaningful variable and function names
- Add comments for complex business logic

### API Design
- RESTful API design principles
- Consistent response format: `{ success: boolean, data: any, message?: string }`
- Proper HTTP status codes
- Input validation and error handling

### Security
- JWT tokens for authentication
- Password hashing with bcryptjs
- CORS configuration
- Input sanitization

## 📊 Database Schema

### Core Models
- **Admin**: System administrators
- **Staff**: Employee records with document uploads
- **Customer**: Customer information
- **Supplier**: Supplier details
- **Item**: Product catalog with categories
- **Warehouse**: Storage locations
- **Stock**: Real-time inventory levels
- **SalesOrder**: Sales transactions
- **PurchaseOrder**: Purchase transactions
- **Invoice**: Billing records
- **Finance**: Income and expense tracking

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use a process manager like PM2
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting service
3. Configure environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For questions or support, please create an issue in the repository.

---

**Last Updated**: December 2024
**Current Status**: Actively developed - Sales & Purchase Orders API integration completed
