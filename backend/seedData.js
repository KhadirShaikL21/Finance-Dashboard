require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const User = require('./models/User');
const Record = require('./models/Record');

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Record.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create test users with different roles
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123456',
        role: 'admin',
        status: 'active',
      },
      {
        name: 'Khadir',
        email: 'khadirshaik2005@gmail.com',
        password: 'admin123456',
        role: 'admin',
        status: 'active',
      },
      {
        name: 'John Analyst',
        email: 'analyst@example.com',
        password: 'analyst123456',
        role: 'analyst',
        status: 'active',
      },
      {
        name: 'Jane Viewer',
        email: 'viewer@example.com',
        password: 'viewer123456',
        role: 'viewer',
        status: 'active',
      },
      {
        name: 'Inactive User',
        email: 'inactive@example.com',
        password: 'inactive123456',
        role: 'viewer',
        status: 'inactive',
      },
    ]);

    console.log(`✅ Created ${users.length} users:`);
    users.forEach((user) => {
      console.log(`   - ${user.email} (${user.role}, ${user.status})`);
    });

    // Create test records for different categories and types
    const adminUser = users[0];
    const analystUser = users[2];

    // Generate 100+ records for pagination demonstration
    const recordsData = [];

    // Admin user records (70+ records for pagination)
    const incomeCategories = ['salary', 'freelance', 'bonus', 'investment'];
    const expenseCategories = ['groceries', 'utilities', 'rent', 'transport', 'entertainment', 'healthcare', 'education', 'other'];

    // Generate multiple records for January, February, March 2026 (past months)
    const monthConfigs = [
      { year: 2026, month: 1, daysInMonth: 31 },
      { year: 2026, month: 2, daysInMonth: 28 },
      { year: 2026, month: 3, daysInMonth: 31 },
    ];

    monthConfigs.forEach(({ year, month, daysInMonth }) => {
      // Income records (every 5 days)
      for (let day = 1; day <= daysInMonth; day += 5) {
        incomeCategories.forEach((category) => {
          recordsData.push({
            userId: adminUser._id,
            amount:
              category === 'salary'
                ? 50000
                : category === 'freelance'
                ? 12000
                : category === 'bonus'
                ? 15000
                : 3000,
            type: 'income',
            category,
            date: new Date(year, month - 1, day),
            notes: `${category} income - ${String(month).padStart(2, '0')}/2026`,
          });
        });
      }

      // Expense records - multiple per category
      for (let day = 1; day <= daysInMonth; day += 3) {
        expenseCategories.forEach((category) => {
          const amounts = {
            groceries: [1500, 2000, 1800, 1200],
            utilities: [1000, 500, 750, 600],
            rent: [15000],
            transport: [500, 300, 450, 600, 750],
            entertainment: [800, 1200, 950, 1500],
            healthcare: [2500, 1000, 3000, 1500],
            education: [5000, 2000, 4000],
            other: [1000, 500, 2000],
          };
          const categoryAmounts = amounts[category] || [1000];

          // Use only the amounts array without adding to day
          categoryAmounts.slice(0, 2).forEach((amount) => {
            recordsData.push({
              userId: adminUser._id,
              amount,
              type: 'expense',
              category,
              date: new Date(year, month - 1, Math.min(day, daysInMonth)),
              notes: `${category} expense - ${String(month).padStart(2, '0')}/2026`,
            });
          });
        });
      }
    });

    // Analyst user records (15+ records) - January to March 2026
    const analystRecordsData = [];
    monthConfigs.forEach(({ year, month, daysInMonth }) => {
      // Salary on 1st and 15th of each month
      [1, 15].forEach((day) => {
        analystRecordsData.push({
          userId: analystUser._id,
          amount: 30000,
          type: 'income',
          category: 'salary',
          date: new Date(year, month - 1, Math.min(day, daysInMonth)),
          notes: `Analyst salary - ${String(month).padStart(2, '0')}/2026`,
        });
      });

      // Regular expenses throughout the month
      const expenseDays = [5, 10, 15, 20, 25];
      expenseDays.forEach((day) => {
        if (day <= daysInMonth) {
          analystRecordsData.push({
            userId: analystUser._id,
            amount: 1000,
            type: 'expense',
            category: 'groceries',
            date: new Date(year, month - 1, day),
            notes: `Analyst groceries - ${String(month).padStart(2, '0')}/2026`,
          });
        }

        // Rent on first day of month, once per month
        if (day === 5) {
          analystRecordsData.push({
            userId: analystUser._id,
            amount: 8000,
            type: 'expense',
            category: 'rent',
            date: new Date(year, month - 1, 1),
            notes: `Analyst rent - ${String(month).padStart(2, '0')}/2026`,
          });
        }
      });
    });

    const records = await Record.create([...recordsData, ...analystRecordsData]);

    console.log(`\n✅ Created ${records.length} financial records:`);
    console.log(`   - For Admin User: ${records.filter((r) => r.userId.toString() === adminUser._id.toString()).length} records`);
    console.log(`   - For Analyst User: ${records.filter((r) => r.userId.toString() === analystUser._id.toString()).length} records`);

    // Summary statistics
    console.log('\n📊 Summary:');
    const adminRecords = records.filter((r) => r.userId.toString() === adminUser._id.toString());
    const totalIncome = adminRecords
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = adminRecords
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    const balance = totalIncome - totalExpense;

    console.log(`   Admin User Total Income: ₹${totalIncome}`);
    console.log(`   Admin User Total Expense: ₹${totalExpense}`);
    console.log(`   Admin User Net Balance: ₹${balance}`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: admin@example.com / admin123456');
    console.log('   Analyst: analyst@example.com / analyst123456');
    console.log('   Viewer: viewer@example.com / viewer123456');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding database:`, error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
