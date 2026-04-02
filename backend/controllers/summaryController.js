const Record = require('../models/Record');

// @desc    Get totals (total income, total expense, net balance)
// @route   GET /api/summary/totals
// @access  Authenticated users
exports.getTotals = async (req, res) => {
  try {
    // Fetch ALL organization records (shared dataset)
    const records = await Record.find();

    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach((record) => {
      if (record.type === 'income') {
        totalIncome += record.amount;
      } else if (record.type === 'expense') {
        totalExpense += record.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;

    res.status(200).json({
      status: 'success',
      data: {
        income: Math.round(totalIncome * 100) / 100,
        expense: Math.round(totalExpense * 100) / 100,
        balance: Math.round(netBalance * 100) / 100,
        recordCount: records.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// @desc    Get summary by category
// @route   GET /api/summary/by-category
// @access  Authenticated users
exports.getByCategory = async (req, res) => {
  try {
    // Fetch ALL organization records (shared dataset)
    const records = await Record.find();

    const categoryData = {};

    records.forEach((record) => {
      if (!categoryData[record.category]) {
        categoryData[record.category] = {
          category: record.category,
          income: 0,
          expense: 0,
          total: 0,
        };
      }

      if (record.type === 'income') {
        categoryData[record.category].income += record.amount;
      } else {
        categoryData[record.category].expense += record.amount;
      }

      categoryData[record.category].total =
        categoryData[record.category].income - categoryData[record.category].expense;
    });

    const summary = Object.fromEntries(
      Object.values(categoryData).sort(
        (a, b) => Math.abs(b.total) - Math.abs(a.total)
      ).map((cat) => [
        cat.category,
        Math.round(cat.total * 100) / 100,
      ])
    );

    res.status(200).json({
      status: 'success',
      count: Object.keys(categoryData).length,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// @desc    Get monthly trends
// @route   GET /api/summary/monthly
// @access  Authenticated users
exports.getMonthlyTrends = async (req, res) => {
  try {
    // Fetch ALL organization records (shared dataset)
    const records = await Record.find();

    const monthlyData = {};

    records.forEach((record) => {
      const month = new Date(record.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });

      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          income: 0,
          expense: 0,
        };
      }

      if (record.type === 'income') {
        monthlyData[month].income += record.amount;
      } else {
        monthlyData[month].expense += record.amount;
      }
    });

    const trends = Object.values(monthlyData).sort(
      (a, b) => new Date(a.month) - new Date(b.month)
    ).map((trend) => ({
      month: trend.month,
      income: Math.round(trend.income * 100) / 100,
      expense: Math.round(trend.expense * 100) / 100,
      balance: Math.round((trend.income - trend.expense) * 100) / 100,
    }));

    res.status(200).json({
      status: 'success',
      count: trends.length,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// @desc    Get recent transactions
// @route   GET /api/summary/recent
// @access  Authenticated users
exports.getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Fetch ALL organization records (shared dataset)
    const records = await Record.find()
      .sort({ date: -1 })
      .limit(limit);

    res.status(200).json({
      status: 'success',
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// @desc    Get comprehensive dashboard summary
// @route   GET /api/summary/dashboard
// @access  Authenticated users
exports.getDashboardSummary = async (req, res) => {
  try {
    // Fetch ALL organization records (shared dataset)
    const records = await Record.find();

    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryData = {};
    const monthlyData = {};
    const weeklyData = {};

    records.forEach((record) => {
      // Income and Expense totals
      if (record.type === 'income') {
        totalIncome += record.amount;
      } else if (record.type === 'expense') {
        totalExpense += record.amount;
      }

      // Category breakdown (with separate income and expense)
      if (!categoryData[record.category]) {
        categoryData[record.category] = {
          category: record.category,
          income: 0,
          expense: 0,
          total: 0,
        };
      }

      if (record.type === 'income') {
        categoryData[record.category].income += record.amount;
      } else {
        categoryData[record.category].expense += record.amount;
      }
      categoryData[record.category].total =
        categoryData[record.category].income - categoryData[record.category].expense;

      // Monthly trends
      const monthKey = new Date(record.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          income: 0,
          expense: 0,
          transactions: 0,
        };
      }

      if (record.type === 'income') {
        monthlyData[monthKey].income += record.amount;
      } else {
        monthlyData[monthKey].expense += record.amount;
      }
      monthlyData[monthKey].transactions += 1;

      // Weekly trends
      const date = new Date(record.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          weekStart: weekKey,
          income: 0,
          expense: 0,
          transactions: 0,
        };
      }

      if (record.type === 'income') {
        weeklyData[weekKey].income += record.amount;
      } else {
        weeklyData[weekKey].expense += record.amount;
      }
      weeklyData[weekKey].transactions += 1;
    });

    const netBalance = totalIncome - totalExpense;

    // Recent transactions (last 10) from shared dataset
    const recentRecords = await Record.find()
      .sort({ date: -1 })
      .limit(10);

    // Convert category data to array and sort by absolute total
    const categoryBreakdown = Object.values(categoryData).sort(
      (a, b) => Math.abs(b.total) - Math.abs(a.total)
    );

    // Convert monthly data to sorted array
    const monthlyTrends = Object.values(monthlyData).sort(
      (a, b) => new Date(a.month) - new Date(b.month)
    );

    // Convert weekly data to sorted array
    const weeklyTrends = Object.values(weeklyData).sort(
      (a, b) => new Date(a.weekStart) - new Date(b.weekStart)
    );

    res.status(200).json({
      status: 'success',
      data: {
        totals: {
          income: Math.round(totalIncome * 100) / 100,
          expense: Math.round(totalExpense * 100) / 100,
          balance: Math.round(netBalance * 100) / 100,
          totalRecords: records.length,
        },
        categoryBreakdown: Object.fromEntries(
          categoryBreakdown.map((cat) => [
            cat.category,
            Math.round(cat.total * 100) / 100,
          ])
        ),
        recentTransactions: recentRecords.map((record) => ({
          _id: record._id,
          type: record.type,
          amount: record.amount,
          category: record.category,
          date: record.date,
          notes: record.notes,
        })),
        monthlyTrends: monthlyTrends.map((trend) => ({
          month: trend.month,
          income: Math.round(trend.income * 100) / 100,
          expense: Math.round(trend.expense * 100) / 100,
          balance: Math.round((trend.income - trend.expense) * 100) / 100,
          transactions: trend.transactions,
        })),
        weeklyTrends: weeklyTrends.map((trend) => ({
          weekStart: trend.weekStart,
          income: Math.round(trend.income * 100) / 100,
          expense: Math.round(trend.expense * 100) / 100,
          balance: Math.round((trend.income - trend.expense) * 100) / 100,
          transactions: trend.transactions,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// @desc    Get insights that work for all users (including viewers/guests)
// @route   GET /api/summary/viewer-insights
// @access  Public (insights for viewers and guests)
exports.getViewerInsights = async (req, res) => {
  try {
    // Get all records from database regardless of userId
    // This allows viewers/guests to see aggregated insights
    const allRecords = await Record.find();

    // Calculate aggregate statistics
    let aggregateIncome = 0;
    let aggregateExpense = 0;
    const categoryDistribution = {};
    const timelineData = {};

    allRecords.forEach((record) => {
      if (record.type === 'income') {
        aggregateIncome += record.amount;
      } else if (record.type === 'expense') {
        aggregateExpense += record.amount;
      }

      // Category distribution
      if (!categoryDistribution[record.category]) {
        categoryDistribution[record.category] = {
          category: record.category,
          count: 0,
          total: 0,
        };
      }
      categoryDistribution[record.category].count += 1;
      categoryDistribution[record.category].total += record.type === 'income' ? record.amount : -record.amount;

      // Timeline distribution
      const date = new Date(record.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
      if (!timelineData[date]) {
        timelineData[date] = {
          date,
          transactions: 0,
        };
      }
      timelineData[date].transactions += 1;
    });

    const netBalance = aggregateIncome - aggregateExpense;

    // Get top categories
    const topCategories = Object.values(categoryDistribution)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get timeline as sorted array
    const timeline = Object.values(timelineData)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); // Last 30 days

    res.status(200).json({
      status: 'success',
      data: {
        aggregateStats: {
          totalIncome: Math.round(aggregateIncome * 100) / 100,
          totalExpense: Math.round(aggregateExpense * 100) / 100,
          netBalance: Math.round(netBalance * 100) / 100,
          totalTransactions: allRecords.length,
        },
        insights: {
          averageTransaction: Math.round((allRecords.length > 0 ? aggregateIncome / allRecords.length : 0) * 100) / 100,
          expenseRatio: allRecords.length > 0 ? Math.round((aggregateExpense / (aggregateIncome + aggregateExpense)) * 100) : 0,
          uniqueCategories: Object.keys(categoryDistribution).length,
        },
        topCategories,
        recentTimeline: timeline,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// @desc    Get analyst-specific insights and advanced analytics
// @route   GET /api/summary/analyst-insights
// @access  Analyst and Admin only
exports.getAnalystInsights = async (req, res) => {
  try {
    const records = await Record.find();

    // Calculate detailed analytics
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryData = {};
    const dailyData = {};
    let averageTransaction = 0;

    records.forEach((record) => {
      if (record.type === 'income') {
        totalIncome += record.amount;
      } else {
        totalExpense += record.amount;
      }
      averageTransaction += record.amount;

      // Category analysis
      if (!categoryData[record.category]) {
        categoryData[record.category] = {
          category: record.category,
          income: 0,
          expense: 0,
          count: 0,
          avgAmount: 0,
        };
      }
      if (record.type === 'income') {
        categoryData[record.category].income += record.amount;
      } else {
        categoryData[record.category].expense += record.amount;
      }
      categoryData[record.category].count += 1;

      // Daily data for trend analysis
      const dateStr = new Date(record.date).toLocaleDateString('en-US');
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = {
          date: dateStr,
          income: 0,
          expense: 0,
          balance: 0,
          count: 0,
        };
      }
      if (record.type === 'income') {
        dailyData[dateStr].income += record.amount;
      } else {
        dailyData[dateStr].expense += record.amount;
      }
      dailyData[dateStr].count += 1;
    });

    // Calculate averages
    averageTransaction = records.length > 0 ? averageTransaction / records.length : 0;

    // Calculate category averages and top performers
    Object.keys(categoryData).forEach((cat) => {
      categoryData[cat].avgAmount = Math.round((categoryData[cat].income + categoryData[cat].expense) / categoryData[cat].count * 100) / 100;
    });

    // Sort categories by total amount
    const topCategories = Object.values(categoryData)
      .sort((a, b) => (Math.abs(b.income - b.expense) - Math.abs(a.income - a.expense)))
      .slice(0, 10);

    // Daily trend data
    const dailyTrends = Object.values(dailyData)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((day) => ({
        ...day,
        balance: Math.round((day.income - day.expense) * 100) / 100,
      }));

    // Calculate growth metrics
    const firstHalfDays = dailyTrends.slice(0, Math.ceil(dailyTrends.length / 2));
    const secondHalfDays = dailyTrends.slice(Math.ceil(dailyTrends.length / 2));

    const firstHalfBalance = firstHalfDays.reduce((sum, d) => sum + d.balance, 0);
    const secondHalfBalance = secondHalfDays.reduce((sum, d) => sum + d.balance, 0);
    const growthTrend = firstHalfDays.length > 0 && secondHalfDays.length > 0 
      ? Math.round(((secondHalfBalance - firstHalfBalance) / Math.abs(firstHalfBalance)) * 100) 
      : 0;

    const netBalance = totalIncome - totalExpense;

    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalIncome: Math.round(totalIncome * 100) / 100,
          totalExpense: Math.round(totalExpense * 100) / 100,
          netBalance: Math.round(netBalance * 100) / 100,
        },
        analytics: {
          averageTransaction: Math.round(averageTransaction * 100) / 100,
          totalTransactions: records.length,
          expenseRatio: totalIncome + totalExpense > 0 
            ? Math.round((totalExpense / (totalIncome + totalExpense)) * 100) 
            : 0,
          incomeRatio: totalIncome + totalExpense > 0 
            ? Math.round((totalIncome / (totalIncome + totalExpense)) * 100) 
            : 0,
          growthTrend: growthTrend,
        },
        topCategories: topCategories.map((cat) => ({
          category: cat.category,
          income: Math.round(cat.income * 100) / 100,
          expense: Math.round(cat.expense * 100) / 100,
          net: Math.round((cat.income - cat.expense) * 100) / 100,
          count: cat.count,
          avgAmount: cat.avgAmount,
        })),
        dailyTrends: dailyTrends.slice(-7), // Last 7 days
        periodComparison: {
          firstPeriodBalance: Math.round(firstHalfBalance * 100) / 100,
          secondPeriodBalance: Math.round(secondHalfBalance * 100) / 100,
          growth: growthTrend,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
