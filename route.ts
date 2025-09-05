

import { NextResponse, type NextRequest } from 'next/server';

// In a real application, you would fetch this data from your database
// or a dedicated analytics service. For this example, we'll use mock data.
const getStatsData = () => {
  return {
    kpis: [
      {
        title: 'Total Users',
        value: '12,405',
        change: '+20.1% from last month',
      },
      {
        title: 'Active Users',
        value: '8,762',
        change: '+12.5% this week',
      },
      {
        title: 'Engagement Score',
        value: '82.5%',
        change: '+2.8% from last month',
      },
      {
          title: 'Goals Created',
          value: '3,456',
          change: '+150 this month',
      }
    ],
    userGrowth: [
      { month: 'January', users: 186 },
      { month: 'February', users: 305 },
      { month: 'March', users: 237 },
      { month: 'April', users: 473 },
      { month: 'May', users: 509 },
      { month: 'June', users: 589 },
    ],
    engagementMetrics: [
      { week: 'Week 1', plansGenerated: 45, budgetsSet: 60 },
      { week: 'Week 2', plansGenerated: 52, budgetsSet: 75 },
      { week: 'Week 3', plansGenerated: 68, budgetsSet: 82 },
      { week: 'Week 4', plansGenerated: 80, budgetsSet: 95 },
    ],
    recentActivities: [
      {
        type: 'new_user',
        user: 'Diana Miller',
        timestamp: '5m ago',
        details: 'Signed up for FinPlus.',
      },
      {
        type: 'goal_achieved',
        user: 'Charlie Brown',
        timestamp: '1h ago',
        details: 'Reached their "Save for Vacation" goal.',
      },
      {
        type: 'plan_generated',
        user: 'Bob Williams',
        timestamp: '3h ago',
        details: 'Generated a new AI financial plan.',
      },
    ],
    content: {
      hero: {
        title: 'Take Control of Your Financial Future.',
        body: 'FinPulse is your all-in-one financial companion. Track your spending, set meaningful goals, and get personalized AI-powered advice to build a healthier financial life.',
        ctaButtonText: 'Get Started for Free',
        image: 'https://picsum.photos/1200/800',
      },
      features: {
        features: [
            { icon: 'LayoutDashboard', title: 'Dashboard Overview', description: 'A consolidated view of key financial metrics, including income, expenses, and net worth.' },
            { icon: 'BarChart3', title: 'Data Visualization', description: 'Generate interactive charts and graphs to visualize financial data trends over time.' },
            { icon: 'Goal', title: 'Goal Setting', description: 'Enable users to set financial goals and track progress towards them effectively.' },
            { icon: 'Gem', title: 'Personalized Financial Tips', description: 'Our AI offers personalized financial advice based on your spending habits and goals.' },
            { icon: 'Shuffle', title: 'Transaction Categorization', description: 'Automatically categorize transactions to understand where your money is going.' },
            { icon: 'Lightbulb', title: 'Smart Insights', description: 'Gain actionable insights to improve your financial health and make better decisions.' },
        ]
      },
      cta: {
        title: "Ready to Take the Next Step?",
        body: "Join thousands of users who are transforming their financial habits. Sign up today to get access to powerful budgeting tools, AI-driven insights, and a community that supports your journey to financial wellness.",
        buttonText: "Join Now",
      },
      footerLinks: {
        about: '/about',
        contact: '/contact',
        features: '/features',
        privacy: '/privacy',
        terms: '/terms',
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
      },
      terms: {
        content: `# Terms of Service\n\nLast updated: ${new Date().toLocaleDateString()}\n\nPlease read these terms and conditions carefully before using Our Service.`
      },
      policy: {
         content: `# Privacy Policy\n\nLast updated: ${new Date().toLocaleDateString()}\n\nThis Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service.`
      }
    },
    users: Array.from({ length: 50 }, (_, i) => ({
      id: `user-${i + 1}`,
      name: `User Name ${i + 1}`,
      email: `user${i + 1}@example.com`,
      avatar: `https://picsum.photos/id/${i + 10}/200/200`,
      signupDate: new Date(new Date().getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      currency: 'USD',
      isAdmin: i < 2, // First 2 users are admins
      isSuspended: i === 3,
      financialData: {
          goals: Math.floor(Math.random() * 10),
          budgets: Math.floor(Math.random() * 5),
          transactions: Math.floor(Math.random() * 500),
      },
      financialPlan: `This is a sample AI-generated financial plan for User Name ${i + 1}. The plan focuses on aggressive growth through diversified investments in tech stocks and emerging markets, with a small allocation to bonds for stability. Regular monthly contributions are key to achieving long-term goals.`
    })),
    monitoring: {
        aiUsageStats: [
            { title: 'AI Advisor Sessions', value: '1,284', icon: 'Bot' },
            { title: 'Smart Alerts Triggered', value: '7,432', icon: 'Zap' },
            { title: 'Auto-Categorizations', value: '54,123', icon: 'Bot' },
        ],
        recentErrors: [
            {
                timestamp: new Date().toISOString(),
                code: 500,
                message: "Failed to connect to third-party API: Service Unavailable",
                trace: `Error: Request failed with status code 503\n    at createError (node_modules/axios/lib/core/createError.js:16:15)\n    at settle (node_modules/axios/lib/core/settle.js:17:12)\n    at IncomingMessage.handleStreamEnd (node_modules/axios/lib/adapters/http.js:269:11)`
            },
            {
                timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                code: 401,
                message: "User authentication token expired.",
                trace: `JsonWebTokenError: jwt expired\n    at Object.verify (node_modules/jsonwebtoken/verify.js:152:17)\n    at authenticateUser (src/middleware/auth.ts:25:21)`
            },
            {
                timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
                code: 400,
                message: "Invalid input for creating a budget.",
                trace: `ValidationError: "monthlyIncome" must be a positive number\n    at Object.exports.validate (node_modules/joi/lib/index.js:189:19)\n    at createBudget (src/controllers/budgetController.ts:45:12)`
            },
        ]
    }
  };
}


export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const expectedApiKey = `Bearer your-super-secret-key-that-should-be-in-a-vault`;

    if (!authHeader || authHeader !== expectedApiKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = getStatsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats data' }, { status: 500 });
  }
}
