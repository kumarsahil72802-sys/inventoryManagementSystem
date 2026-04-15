/**
 * Pagination Helper for MongoDB queries
 * Provides consistent pagination across all controllers
 */

/**
 * Extract pagination parameters from request query
 * @param {Object} query - Express request.query object
 * @param {Object} options - Default options
 * @returns {Object} Pagination parameters
 */
export const getPaginationParams = (query, options = {}) => {
  const {
    defaultPage = 1,
    defaultLimit = 10,
    maxLimit = 100
  } = options;

  // Parse page number (default to 1, minimum 1)
  let page = parseInt(query.page, 10);
  if (isNaN(page) || page < 1) {
    page = defaultPage;
  }

  // Parse limit (default to 10, max 100)
  let limit = parseInt(query.limit, 10);
  if (isNaN(limit) || limit < 1) {
    limit = defaultLimit;
  }
  // Cap the limit to prevent excessive data fetching
  if (limit > maxLimit) {
    limit = maxLimit;
  }

  // Calculate skip value for MongoDB
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Create pagination metadata for response
 * @param {number} totalCount - Total number of records
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export const createPaginationMeta = (totalCount, page, limit) => {
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    currentPage: page,
    itemsPerPage: limit,
    totalItems: totalCount,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

/**
 * Execute paginated MongoDB query
 * @param {Object} model - Mongoose model
 * @param {Object} filter - MongoDB filter query
 * @param {Object} options - Query options (sort, populate, etc.)
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Query results with pagination metadata
 */
export const executePaginatedQuery = async (model, filter = {}, options = {}, page = 1, limit = 10) => {
  const { sort = { createdAt: -1 }, populate = [], select = null } = options;
  
  const skip = (page - 1) * limit;
  
  // Build the query
  let query = model.find(filter);
  
  // Apply select fields if specified
  if (select) {
    query = query.select(select);
  }
  
  // Apply population
  if (populate && populate.length > 0) {
    populate.forEach(pop => {
      query = query.populate(pop);
    });
  }
  
  // Execute query with pagination
  const [data, totalCount] = await Promise.all([
    query.sort(sort).skip(skip).limit(limit).exec(),
    model.countDocuments(filter)
  ]);
  
  return {
    data,
    pagination: createPaginationMeta(totalCount, page, limit)
  };
};

/**
 * Create standard paginated response
 * @param {Array} data - Query results
 * @param {Object} pagination - Pagination metadata
 * @param {string} message - Success message
 * @returns {Object} Standardized response object
 */
export const createPaginatedResponse = (data, pagination, message = 'Data fetched successfully') => {
  return {
    success: true,
    message,
    data,
    pagination
  };
};

/**
 * Create error response
 * @param {string} message - Error message
 * @param {Error} error - Error object
 * @returns {Object} Error response object
 */
export const createErrorResponse = (message, error) => {
  return {
    success: false,
    message,
    error: error?.message || error
  };
};
