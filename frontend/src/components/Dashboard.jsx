import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { summaryService, recordService, userService } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [searchCategory, setSearchCategory] = useState('');
  const [searchType, setSearchType] = useState('');

  const [showRecordForm, setShowRecordForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    type: 'income',
    category: 'salary',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('viewer');

  useEffect(() => {
    loadDashboardData();
  }, [activeTab, pagination.page, searchCategory, searchType]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (activeTab === 'dashboard') {
        const summaryData = await summaryService.getDashboardSummary();
        setSummary(summaryData.data);
      } else if (activeTab === 'records') {
        const recordsData = await recordService.getRecords({
          page: pagination.page,
          limit: pagination.limit,
          category: searchCategory || '',
          type: searchType || '',
        });
        setRecords(recordsData.data || []);
        if (recordsData.pagination) {
          setPagination(prev => ({
            ...prev,
            total: recordsData.pagination.total,
            pages: recordsData.pagination.pages
          }));
        }
      } else if (activeTab === 'users' && user.role === 'admin') {
        const usersData = await userService.getAllUsers();
        setUsers(usersData.data || []);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) {
      setError('Please fill all required fields');
      return;
    }

    try {
      if (editingRecord) {
        await recordService.updateRecord(editingRecord._id, {
          type: formData.type,
          category: formData.category,
          amount: parseFloat(formData.amount),
          date: formData.date,
          notes: formData.notes,
        });
        setSuccess('Record updated successfully!');
      } else {
        await recordService.createRecord({
          type: formData.type,
          category: formData.category,
          amount: parseFloat(formData.amount),
          date: formData.date,
          notes: formData.notes,
        });
        setSuccess('Record created successfully!');
      }

      setPagination({ ...pagination, page: 1 });
      setTimeout(() => {
        loadDashboardData();
        setShowRecordForm(false);
        setEditingRecord(null);
        setFormData({
          type: 'income',
          category: 'salary',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          notes: '',
        });
      }, 500);
    } catch (err) {
      setError(err.message || 'Error saving record');
    }
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setFormData({
      type: record.type,
      category: record.category,
      amount: record.amount.toString(),
      date: record.date.split('T')[0],
      notes: record.notes || '',
    });
    setShowRecordForm(true);
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await recordService.deleteRecord(id);
      setSuccess('Record deleted successfully!');
      setPagination({ ...pagination, page: 1 });
      setTimeout(() => loadDashboardData(), 500);
    } catch (err) {
      setError(err.message || 'Error deleting record');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.deleteUser(id);
      setSuccess('User deleted successfully!');
      setTimeout(() => loadDashboardData(), 500);
    } catch (err) {
      setError(err.message || 'Error deleting user');
    }
  };

  const handleUpdateUserRole = async (userId, currentRole) => {
    if (!window.confirm(`Change role from ${currentRole} to ${newRole}?`)) return;

    try {
      await userService.updateUser(userId, { role: newRole });
      setSuccess('User role updated successfully!');
      setEditingUser(null);
      setNewRole('viewer');
      setTimeout(() => loadDashboardData(), 500);
    } catch (err) {
      setError(err.message || 'Error updating user role');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                  💰 Finance Hub
                </h1>
                <p className="text-sm text-slate-600 mt-1">Organization Financial Dashboard</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 backdrop-blur-md bg-white/30 border border-white/50 rounded-xl">
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-md ${
                    user.role === 'admin' ? 'bg-red-500/20 text-red-700 border border-red-300/30' :
                    user.role === 'analyst' ? 'bg-blue-500/20 text-blue-700 border border-blue-300/30' :
                    'bg-slate-400/20 text-slate-700 border border-slate-300/30'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-5 py-2 backdrop-blur-md bg-red-500/10 border border-red-300/30 text-red-700 rounded-xl font-semibold hover:bg-red-500/20 transition-all duration-300 hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Alerts */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="p-4 backdrop-blur-md bg-red-500/10 border border-red-300/30 rounded-xl animate-slide-down">
              <p className="text-sm text-red-700 font-semibold">{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="p-4 backdrop-blur-md bg-green-500/10 border border-green-300/30 rounded-xl animate-slide-down">
              <p className="text-sm text-green-700 font-semibold">{success}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <nav className="backdrop-blur-xl bg-white/30 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'dashboard'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'records'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                📝 Records
              </button>
              {(user.role === 'analyst' || user.role === 'admin') && (
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-300 ${
                    activeTab === 'analytics'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📊 Analytics
                </button>
              )}
              {user.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-300 ${
                    activeTab === 'users'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  👥 Users
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600 font-semibold">Loading...</p>
            </div>
          ) : activeTab === 'dashboard' && summary ? (
            <DashboardView summary={summary} userRole={user.role} />
          ) : activeTab === 'records' ? (
            <RecordsView
              records={records}
              pagination={pagination}
              searchCategory={searchCategory}
              setSearchCategory={setSearchCategory}
              searchType={searchType}
              setSearchType={setSearchType}
              onPaginate={(page) => setPagination({ ...pagination, page })}
              onDelete={handleDeleteRecord}
              userRole={user.role}
              onEdit={handleEditRecord}
              onAddNew={() => {
                setEditingRecord(null);
                setFormData({
                  type: 'income',
                  category: 'salary',
                  amount: '',
                  date: new Date().toISOString().split('T')[0],
                  notes: '',
                });
                setShowRecordForm(true);
              }}
              showForm={showRecordForm}
              formData={formData}
              editingRecord={editingRecord}
              onSubmitForm={handleCreateRecord}
              onFormChange={setFormData}
              onCancel={() => setShowRecordForm(false)}
            />
          ) : activeTab === 'analytics' && (user.role === 'analyst' || user.role === 'admin') ? (
            <AnalyticsView userRole={user.role} />
          ) : activeTab === 'users' ? (
            <UsersView
              users={users}
              onDelete={handleDeleteUser}
              onEditRole={setEditingUser}
              onUpdateRole={handleUpdateUserRole}
              editingUser={editingUser}
              newRole={newRole}
              setNewRole={setNewRole}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
};

const DashboardView = ({ summary, userRole }) => {
  const getIncomePercentage = () => {
    const total = summary.totals.income + Math.abs(summary.totals.expense);
    return total > 0 ? (summary.totals.income / total) * 100 : 0;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Financial Summary</h2>

      {/* Summary Cards with Glassy Effect */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-300/30 rounded-2xl p-8 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:scale-105">
          <div className="text-5xl mb-4">📈</div>
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Total Income</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-3">₹{summary.totals.income.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-2">Organization total</p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-300/30 rounded-2xl p-8 hover:border-red-400/50 transition-all duration-300 hover:shadow-xl hover:scale-105">
          <div className="text-5xl mb-4">📉</div>
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Total Expenses</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mt-3">₹{summary.totals.expense.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-2">Organization total</p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-300/30 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:scale-105">
          <div className="text-5xl mb-4">💎</div>
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Net Balance</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-3">₹{summary.totals.balance.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-2">Net Position</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Income vs Expense Ratio</h3>
          <div className="flex gap-1 h-12 rounded-full overflow-hidden bg-slate-200/50 mb-6 shadow-inner">
            <div
              className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${getIncomePercentage()}%` }}
            ></div>
            <div
              className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 transition-all duration-500"
              style={{ width: `${100 - getIncomePercentage()}%` }}
            ></div>
          </div>
          <div className="flex gap-6 text-sm font-bold">
            <span className="text-slate-700">📈 Income: <span className="text-green-600">{getIncomePercentage().toFixed(1)}%</span></span>
            <span className="text-slate-700">📉 Expense: <span className="text-red-600">{(100 - getIncomePercentage()).toFixed(1)}%</span></span>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Top Categories</h3>
          <div className="space-y-4">
            {Object.entries(summary.categoryBreakdown)
              .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
              .slice(0, 5)
              .map(([category, amount]) => (
                <div key={category} className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-700 w-28 capitalize">{category}</span>
                  <div className="flex-1 bg-slate-200/50 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${amount >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}
                      style={{
                        width: `${(Math.abs(amount) / Math.max(...Object.values(summary.categoryBreakdown).map(Math.abs))) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className={`text-sm font-bold w-24 text-right ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{Math.abs(amount).toFixed(0)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Transactions</h3>
        <div className="space-y-3">
          {summary.recentTransactions.slice(0, 8).map((tx) => (
            <div key={tx._id} className="flex items-center justify-between p-4 rounded-xl backdrop-blur-md bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300 hover:border-white/50">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl backdrop-blur-md ${
                  tx.type === 'income' ? 'bg-green-500/20 border border-green-300/50' : 'bg-red-500/20 border border-red-300/50'
                }`}>
                  {tx.type === 'income' ? '📥' : '📤'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 capitalize">{tx.category}</p>
                  <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <span className={`font-bold text-lg ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnalyticsView = ({ userRole }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await summaryService.getAnalystInsights();
        setAnalyticsData(response.data);
      } catch (err) {
        console.error('Error loading analytics:', err);
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-semibold">Loading Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-2xl p-8 text-center">
        <p className="text-lg text-red-600 font-semibold">❌ {error}</p>
        <p className="text-sm text-slate-600 mt-2">Please try again later or contact support</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-2xl p-8 text-center">
        <p className="text-lg text-slate-600 font-semibold">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Advanced Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-300/30 rounded-2xl p-8">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Total Income</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{analyticsData.summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-300/30 rounded-2xl p-8">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Total Expense</p>
          <p className="text-3xl font-bold text-red-600 mt-2">₹{analyticsData.summary.totalExpense.toFixed(2)}</p>
        </div>
        <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-300/30 rounded-2xl p-8">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Net Balance</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹{analyticsData.summary.netBalance.toFixed(2)}</p>
        </div>
      </div>

      {/* Analytics Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-2xl p-6">
          <p className="text-xs font-bold text-slate-600 uppercase">Avg Transaction</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">₹{analyticsData.analytics.averageTransaction.toFixed(2)}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-2xl p-6">
          <p className="text-xs font-bold text-slate-600 uppercase">Total Transactions</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{analyticsData.analytics.totalTransactions}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-2xl p-6">
          <p className="text-xs font-bold text-slate-600 uppercase">Expense Ratio</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{analyticsData.analytics.expenseRatio}%</p>
        </div>
        <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-2xl p-6">
          <p className="text-xs font-bold text-slate-600 uppercase">Growth Trend</p>
          <p className={`text-2xl font-bold mt-2 ${analyticsData.analytics.growthTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analyticsData.analytics.growthTrend > 0 ? '+' : ''}{analyticsData.analytics.growthTrend}%
          </p>
        </div>
      </div>

      {/* Top Categories */}
      <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Top Categories by Activity</h3>
        <div className="space-y-4">
          {analyticsData.topCategories.slice(0, 8).map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/30 border border-white/20">
              <div className="flex-1">
                <div className="font-semibold text-slate-900 capitalize">{cat.category}</div>
                <div className="text-xs text-slate-600 mt-1">
                  {cat.count} transactions • Avg: ₹{cat.avgAmount.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${cat.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {cat.net >= 0 ? '+' : ''}₹{cat.net.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecordsView = ({
  records,
  pagination,
  searchCategory,
  setSearchCategory,
  searchType,
  setSearchType,
  onPaginate,
  onDelete,
  userRole,
  onEdit,
  onAddNew,
  showForm,
  formData,
  editingRecord,
  onSubmitForm,
  onFormChange,
  onCancel,
}) => {
  const incomeCategories = ['salary', 'freelance', 'bonus', 'investment'];
  const expenseCategories = ['groceries', 'utilities', 'rent', 'transport', 'entertainment', 'healthcare', 'education', 'other'];
  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;
  const isAdmin = userRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Financial Records</h2>
        {isAdmin && (
          <button onClick={onAddNew} className="btn-primary">
            ➕ Add Record
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
              Filter by Type
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="select-field w-full"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
              Filter by Category
            </label>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="select-field w-full"
            >
              <option value="">All Categories</option>
              {[...incomeCategories, ...expenseCategories].map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-900">{records.length}</span> of{' '}
              <span className="font-bold text-slate-900">{pagination.total}</span> records
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-8 w-full max-w-md animate-slide-up">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              {editingRecord ? '✏️ Edit Record' : '➕ Create New Record'}
            </h3>
            <form onSubmit={onSubmitForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      onFormChange({
                        ...formData,
                        type: e.target.value,
                        category: e.target.value === 'income' ? 'salary' : 'groceries',
                      });
                    }}
                    className="select-field w-full"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => onFormChange({ ...formData, category: e.target.value })}
                    className="select-field w-full"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => onFormChange({ ...formData, amount: e.target.value })}
                    className="input-field w-full"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => onFormChange({ ...formData, date: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => onFormChange({ ...formData, notes: e.target.value })}
                  className="input-field w-full"
                  rows="3"
                  placeholder="Optional notes..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingRecord ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn-secondary flex-1" onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Records Table */}
      {records.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Notes
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.map((record) => (
                <tr key={record._id} className="table-row">
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="badge badge-blue">
                      {record.category.charAt(0).toUpperCase() + record.category.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`badge ${record.type === 'income' ? 'badge-green' : 'badge-red'}`}>
                      {record.type === 'income' ? '📈 Income' : '📉 Expense'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {record.type === 'income' ? '+' : '-'}₹{record.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                    {record.notes || '-'}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => onEdit(record)}
                          className="w-9 h-9 inline-flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-lg"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDelete(record._id)}
                          className="w-9 h-9 inline-flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors text-lg"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-slate-600 text-lg">No records found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="card p-6">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => onPaginate(1)}
              disabled={pagination.page === 1}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⬅️ First
            </button>
            <button
              onClick={() => onPaginate(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ◀ Previous
            </button>

            <span className="text-sm font-semibold text-slate-700 min-w-max">
              Page <span className="text-blue-600">{pagination.page}</span> of{' '}
              <span className="text-blue-600">{pagination.pages}</span>
            </span>

            <button
              onClick={() => onPaginate(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next ▶
            </button>
            <button
              onClick={() => onPaginate(pagination.pages)}
              disabled={pagination.page === pagination.pages}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const UsersView = ({ users, onDelete, onEditRole, onUpdateRole, editingUser, newRole, setNewRole }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">User Management</h2>

      {users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <div key={u._id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{u.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">{u.email}</p>
                </div>
                <span className={`badge text-xs ${
                  u.status === 'active' ? 'badge-green' : 'badge-red'
                }`}>
                  {u.status.toUpperCase()}
                </span>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Role
                </label>
                {editingUser === u._id ? (
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="select-field w-full"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="analyst">Analyst</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className={`badge badge-blue`}>
                    {u.role.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {editingUser === u._id ? (
                  <>
                    <button
                      onClick={() => onUpdateRole(u._id, u.role)}
                      className="btn-primary flex-1 text-sm"
                    >
                      ✓ Save
                    </button>
                    <button className="btn-secondary flex-1 text-sm" onClick={() => onEditRole(null)}>
                      ✕ Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onEditRole(u._id);
                        setNewRole(u.role);
                      }}
                      className="btn-secondary flex-1 text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-danger flex-1 text-sm"
                      onClick={() => onDelete(u._id)}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-slate-600 text-lg">No users found</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
