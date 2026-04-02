const Record = require('../models/Record');

// @desc    Create a financial record
// @route   POST /api/records
// @access  Admin only
exports.createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!amount) missingFields.push('amount');
    if (!type) missingFields.push('type');
    if (!category) missingFields.push('category');
    if (!date) missingFields.push('date');

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        code: 'MISSING_REQUIRED_FIELDS',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields,
      });
    }

    // Validate amount is a positive number
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(422).json({
        status: 'error',
        code: 'INVALID_AMOUNT',
        message: 'Amount must be a positive number greater than 0',
        field: 'amount',
      });
    }

    // Validate type
    const validTypes = ['income', 'expense'];
    if (!validTypes.includes(type)) {
      return res.status(422).json({
        status: 'error',
        code: 'INVALID_TYPE',
        message: `Type must be one of: ${validTypes.join(', ')}`,
        field: 'type',
        validValues: validTypes,
      });
    }

    // Validate category
    const validCategories = [
      'salary',
      'bonus',
      'freelance',
      'investment',
      'groceries',
      'utilities',
      'rent',
      'transport',
      'entertainment',
      'healthcare',
      'education',
      'other',
    ];
    if (!validCategories.includes(category)) {
      return res.status(422).json({
        status: 'error',
        code: 'INVALID_CATEGORY',
        message: `Category must be one of: ${validCategories.join(', ')}`,
        field: 'category',
        validValues: validCategories,
      });
    }

    // Validate date
    const recordDate = new Date(date);
    if (isNaN(recordDate.getTime())) {
      return res.status(422).json({
        status: 'error',
        code: 'INVALID_DATE_FORMAT',
        message: 'Date must be a valid ISO date string (e.g., 2026-03-15)',
        field: 'date',
      });
    }

    // Check date is not in future
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (recordDate > today) {
      return res.status(422).json({
        status: 'error',
        code: 'FUTURE_DATE_NOT_ALLOWED',
        message: 'Date cannot be in the future. Please enter a past or current date.',
        field: 'date',
        providedDate: recordDate,
        today,
      });
    }

    // Validate notes if provided
    if (notes && typeof notes !== 'string') {
      return res.status(422).json({
        status: 'error',
        code: 'INVALID_NOTES',
        message: 'Notes must be a string',
        field: 'notes',
      });
    }

    if (notes && notes.length > 500) {
      return res.status(422).json({
        status: 'error',
        code: 'NOTES_TOO_LONG',
        message: 'Notes cannot exceed 500 characters',
        field: 'notes',
        currentLength: notes.length,
        maxLength: 500,
      });
    }

    // Create record (userId is optional - just tracks who created it)
    const record = await Record.create({
      userId: req.userId, // From auth middleware (for audit trail)
      amount,
      type,
      category,
      date: recordDate,
      notes: notes ? notes.trim() : notes,
    });

    res.status(201).json({
      status: 'success',
      message: 'Record created successfully',
      data: record,
    });
  } catch (error) {
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(422).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: messages,
      });
    }

    // Handle other errors
    res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
};

// @desc    Get all financial records with filters
// @route   GET /api/records
// @access  Authenticated users (Viewer, Analyst, Admin - all see shared org data)
exports.getAllRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Validate pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    if (pageNum < 1) {
      return res.status(422).json({
        status: 'error',
        code: 'INVALID_PAGE',
        message: 'Page number must be greater than 0',
        field: 'page',
      });
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(422).json({
        status: 'error',
        code: 'INVALID_LIMIT',
        message: 'Limit must be between 1 and 100',
        field: 'limit',
        current: limitNum,
      });
    }

    // Build filter - NO userId filtering, this is all shared organization data
    let filter = {};

    // Validate and apply type filter
    if (type && type !== '' && type !== 'all') {
      const validTypes = ['income', 'expense'];
      if (!validTypes.includes(type)) {
        return res.status(422).json({
          status: 'error',
          code: 'INVALID_TYPE_FILTER',
          message: `Type filter must be one of: ${validTypes.join(', ')}`,
          field: 'type',
          validValues: validTypes,
        });
      }
      filter.type = type;
    }

    // Validate and apply category filter
    if (category && category !== '' && category !== 'all') {
      const validCategories = [
        'salary',
        'bonus',
        'freelance',
        'investment',
        'groceries',
        'utilities',
        'rent',
        'transport',
        'entertainment',
        'healthcare',
        'education',
        'other',
      ];
      if (!validCategories.includes(category)) {
        return res.status(422).json({
          status: 'error',
          code: 'INVALID_CATEGORY_FILTER',
          message: `Category filter must be one of: ${validCategories.join(', ')}`,
          field: 'category',
          validValues: validCategories,
        });
      }
      filter.category = category;
    }

    // Date range filtering with validation
    if (startDate || endDate) {
      filter.date = {};
      
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          return res.status(422).json({
            status: 'error',
            code: 'INVALID_START_DATE',
            message: 'startDate must be a valid ISO date string (e.g., 2026-03-15)',
            field: 'startDate',
          });
        }
        filter.date.$gte = start;
      }
      
      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
          return res.status(422).json({
            status: 'error',
            code: 'INVALID_END_DATE',
            message: 'endDate must be a valid ISO date string (e.g., 2026-03-15)',
            field: 'endDate',
          });
        }
        filter.date.$lte = end;
      }
    }

    // Pagination calculations
    const skip = (pageNum - 1) * limitNum;

    // Fetch records
    const records = await Record.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Record.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      count: records.length,
      pagination: {
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
};

// @desc    Get record by ID
// @route   GET /api/records/:id
// @access  Authenticated users (Viewer, Analyst, Admin)
exports.getRecordById = async (req, res) => {
  try {
    // Validate record ID
    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_RECORD_ID',
        message: 'Invalid record ID format',
        field: 'id',
      });
    }

    // Fetch record from shared organization dataset (no userId check)
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        status: 'error',
        code: 'RECORD_NOT_FOUND',
        message: 'Record not found',
        recordId: req.params.id,
      });
    }

    res.status(200).json({
      status: 'success',
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
};

// @desc    Update a record
// @route   PUT /api/records/:id
// @access  Admin only
exports.updateRecord = async (req, res) => {
  try {
    // Validate record ID
    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_RECORD_ID',
        message: 'Invalid record ID format',
        field: 'id',
      });
    }

    const { amount, type, category, date, notes } = req.body;

    // At least one field must be provided for update
    if (!amount && !type && !category && !date && !notes) {
      return res.status(400).json({
        status: 'error',
        code: 'NO_UPDATE_FIELDS',
        message: 'At least one field must be provided to update (amount, type, category, date, or notes)',
      });
    }

    // Validate and prepare update object
    const updateData = {};

    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(422).json({
          status: 'error',
          code: 'INVALID_AMOUNT',
          message: 'Amount must be a positive number greater than 0',
          field: 'amount',
        });
      }
      updateData.amount = amount;
    }

    if (type !== undefined) {
      const validTypes = ['income', 'expense'];
      if (!validTypes.includes(type)) {
        return res.status(422).json({
          status: 'error',
          code: 'INVALID_TYPE',
          message: `Type must be one of: ${validTypes.join(', ')}`,
          field: 'type',
          validValues: validTypes,
        });
      }
      updateData.type = type;
    }

    if (category !== undefined) {
      const validCategories = [
        'salary',
        'bonus',
        'freelance',
        'investment',
        'groceries',
        'utilities',
        'rent',
        'transport',
        'entertainment',
        'healthcare',
        'education',
        'other',
      ];
      if (!validCategories.includes(category)) {
        return res.status(422).json({
          status: 'error',
          code: 'INVALID_CATEGORY',
          message: `Category must be one of: ${validCategories.join(', ')}`,
          field: 'category',
          validValues: validCategories,
        });
      }
      updateData.category = category;
    }

    if (date !== undefined) {
      const recordDate = new Date(date);
      if (isNaN(recordDate.getTime())) {
        return res.status(422).json({
          status: 'error',
          code: 'INVALID_DATE_FORMAT',
          message: 'Date must be a valid ISO date string (e.g., 2026-03-15)',
          field: 'date',
        });
      }

      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (recordDate > today) {
        return res.status(422).json({
          status: 'error',
          code: 'FUTURE_DATE_NOT_ALLOWED',
          message: 'Date cannot be in the future. Please enter a past or current date.',
          field: 'date',
          providedDate: recordDate,
          today,
        });
      }
      updateData.date = recordDate;
    }

    if (notes !== undefined) {
      if (typeof notes !== 'string') {
        return res.status(422).json({
          status: 'error',
          code: 'INVALID_NOTES',
          message: 'Notes must be a string',
          field: 'notes',
        });
      }

      if (notes.length > 500) {
        return res.status(422).json({
          status: 'error',
          code: 'NOTES_TOO_LONG',
          message: 'Notes cannot exceed 500 characters',
          field: 'notes',
          currentLength: notes.length,
          maxLength: 500,
        });
      }
      updateData.notes = notes.trim();
    }

    // Find record and verify it exists
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        status: 'error',
        code: 'RECORD_NOT_FOUND',
        message: 'Record not found',
        recordId: req.params.id,
      });
    }

    // Update the record with validation
    updateData.updatedAt = Date.now();
    const updatedRecord = await Record.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      message: 'Record updated successfully',
      data: updatedRecord,
    });
  } catch (error) {
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(422).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: messages,
      });
    }

    res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
};

// @desc    Delete a record
// @route   DELETE /api/records/:id
// @access  Admin only
exports.deleteRecord = async (req, res) => {
  try {
    // Validate record ID
    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_RECORD_ID',
        message: 'Invalid record ID format',
        field: 'id',
      });
    }

    // Find record
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        status: 'error',
        code: 'RECORD_NOT_FOUND',
        message: 'Record not found',
        recordId: req.params.id,
      });
    }

    // Delete the record
    await Record.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Record deleted successfully',
      data: {
        _id: record._id,
        category: record.category,
        amount: record.amount,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
