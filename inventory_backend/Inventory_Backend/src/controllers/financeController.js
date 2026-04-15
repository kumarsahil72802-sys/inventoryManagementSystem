import { ExpenseModel, IncomeModel } from '../models/financeModel.js';
import { getPaginationParams, executePaginatedQuery, createPaginatedResponse, createErrorResponse } from '../utils/paginationHelper.js';

// Expenses with pagination
export const getAllExpenses = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      ExpenseModel,
      {},
      { sort: { createdAt: -1 } },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Expenses fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching expenses', error));
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const expense = await ExpenseModel.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expense',
      error: error.message
    });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { 
      id, name, type, category, amount, date, vendor, 
      warehouse, department, description, paymentMode, 
      employee, createdBy 
    } = req.body;

    // Basic Validation
    if (!id || !name || !type || !category || amount == null || !date || !vendor || 
        !warehouse || !department || !description || !paymentMode || 
        !employee || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ID, Name, Type, Category, Amount, Date, Vendor, Warehouse, Department, Description, PaymentMode, Employee, CreatedBy) are required'
      });
    }

    if (isNaN(amount) || amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a non-negative number'
      });
    }

    const expense = new ExpenseModel(req.body);
    await expense.save();
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating expense',
      error: error.message
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount !== undefined && (isNaN(amount) || amount < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a non-negative number'
      });
    }

    const expense = await ExpenseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating expense',
      error: error.message
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await ExpenseModel.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting expense',
      error: error.message
    });
  }
};

// Income with pagination
export const getAllIncome = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      IncomeModel,
      {},
      { sort: { createdAt: -1 } },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Income records fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching income', error));
  }
};

export const getIncomeById = async (req, res) => {
  try {
    const income = await IncomeModel.findById(req.params.id);
    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found'
      });
    }
    res.json({
      success: true,
      data: income
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching income',
      error: error.message
    });
  }
};

export const createIncome = async (req, res) => {
  try {
    const { 
      id, incomeType, date, receivedFrom, amount, 
      paymentMode, warehouse, department, description, createdBy 
    } = req.body;

    // Basic Validation
    if (!id || !incomeType || !date || !receivedFrom || amount == null || 
        !paymentMode || !warehouse || !department || !description || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ID, Income Type, Date, Received From, Amount, Payment Mode, Warehouse, Department, Description, CreatedBy) are required'
      });
    }

    if (isNaN(amount) || amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a non-negative number'
      });
    }

    const income = new IncomeModel(req.body);
    await income.save();
    res.status(201).json({
      success: true,
      message: 'Income created successfully',
      data: income
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating income',
      error: error.message
    });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const income = await IncomeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found'
      });
    }
    res.json({
      success: true,
      message: 'Income updated successfully',
      data: income
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating income',
      error: error.message
    });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const income = await IncomeModel.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found'
      });
    }
    res.json({
      success: true,
      message: 'Income deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting income',
      error: error.message
    });
  }
};

// Get expenses by warehouse
export const getExpensesByWarehouse = async (req, res) => {
  try {
    const { warehouse } = req.params;
    const expenses = await ExpenseModel.find({ warehouse }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses by warehouse',
      error: error.message
    });
  }
};

// Get income by warehouse
export const getIncomeByWarehouse = async (req, res) => {
  try {
    const { warehouse } = req.params;
    const income = await IncomeModel.find({ warehouse }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: income
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching income by warehouse',
      error: error.message
    });
  }
};

