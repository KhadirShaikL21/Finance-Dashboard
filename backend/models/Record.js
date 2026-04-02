const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional - just for tracking who created/modified the record
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: 'Amount must be greater than 0',
      },
    },
    type: {
      type: String,
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be either income or expense',
      },
      required: [true, 'Please specify income or expense'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: {
        values: [
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
        ],
        message: 'Please select a valid category',
      },
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
      validate: {
        validator: function (value) {
          // Prevent future dates - date cannot be after today
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          return value <= today;
        },
        message: 'Date cannot be in the future. Please enter a past or current date.',
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
recordSchema.index({ date: -1 });
recordSchema.index({ type: 1 });
recordSchema.index({ category: 1 });
recordSchema.index({ userId: 1 }); // For tracking who created records

module.exports = mongoose.model('Record', recordSchema);
