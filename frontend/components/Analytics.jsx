import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getAllAnalytics } from '../services/analyticsService';
import Layout from './Layout';
import LoadingSpinner from './ui/LoadingSpinner';
import Button from './ui/Button';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { RefreshCw, TrendingUp, Package, AlertTriangle, BarChart3 } from 'lucide-react';

const Analytics = ({ darkMode, user, onLogout, toggleTheme, onOpenProfile }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const analyticsData = await getAllAnalytics();
      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Intentional Editorial Chart Palette (Zero Neon Slop)
  const PIE_COLORS = ['#15803D', '#111111', '#D97706', '#4A4A46', '#DC2626', '#16A34A', '#767670', '#B45309'];

  if (loading) {
    return (
      <Layout
        user={user}
        onLogout={onLogout}
        toggleTheme={toggleTheme}
        darkMode={darkMode}
        title="Shelf Analytics"
        onOpenProfile={onOpenProfile}
      >
        <Helmet>
          <title>Analytics | Inventa Inventory Management</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="lg" variant="primary" />
          <p className={`mt-4 text-sm font-medium ${darkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}`}>
            Loading shelf telemetry...
          </p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout
        user={user}
        onLogout={onLogout}
        toggleTheme={toggleTheme}
        darkMode={darkMode}
        title="Shelf Analytics"
        onOpenProfile={onOpenProfile}
      >
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle className="w-12 h-12 text-[#D97706] mb-3" />
          <p className="text-base font-medium mb-4">{error}</p>
          <Button variant="accent" onClick={fetchAnalytics}>
            <RefreshCw size={15} className="mr-2" />
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      user={user}
      onLogout={onLogout}
      toggleTheme={toggleTheme}
      darkMode={darkMode}
      title="Shelf Analytics"
      onOpenProfile={onOpenProfile}
    >
      <Helmet>
        <title>Analytics | Inventa Inventory Management</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Shelf Health &amp; Shrinkage Telemetry</h2>
          <p className={`text-sm mt-1 ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
            Real-time expiration distribution, category volume, and 12-month forecast
          </p>
        </div>
        <Button variant="outline" onClick={fetchAnalytics} className="self-start sm:self-auto">
          <RefreshCw size={15} className="mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Shelf Health Score"
          value={`${data?.stats?.healthScore || 0}%`}
          icon={TrendingUp}
          tone="good"
          darkMode={darkMode}
          subtitle={getHealthLabel(data?.stats?.healthScore)}
        />
        <MetricCard
          title="Tracked SKUs"
          value={data?.stats?.totalProducts || 0}
          icon={Package}
          tone="neutral"
          darkMode={darkMode}
          subtitle={`${data?.stats?.categories || 0} active categories`}
        />
        <MetricCard
          title="Expiring This Week"
          value={data?.stats?.expiringThisWeek || 0}
          icon={AlertTriangle}
          tone="warning"
          darkMode={darkMode}
          subtitle="Requires FEFO rotation"
        />
        <MetricCard
          title="Expired Write-Offs"
          value={data?.waste?.totalExpired || 0}
          icon={BarChart3}
          tone="critical"
          darkMode={darkMode}
          subtitle={`${data?.waste?.totalExpiredQuantity || 0} total units`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Expiration Horizon Breakdown" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={prepareExpiryTrendsData(data?.trends)}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#262626' : '#E4E4E0'} />
              <XAxis dataKey="name" stroke={darkMode ? '#A3A39E' : '#767670'} style={{ fontSize: '11px' }} />
              <YAxis stroke={darkMode ? '#A3A39E' : '#767670'} style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#141414' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#262626' : '#E4E4E0'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#F5F5F3' : '#111111'
                }}
              />
              <Bar dataKey="count" fill="#15803D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Distribution" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data?.categories?.distribution || []}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={95}
                label={({ category, percentage }) => `${category} (${percentage}%)`}
                labelStyle={{ fontSize: '11px', fill: darkMode ? '#F5F5F3' : '#111111' }}
              >
                {(data?.categories?.distribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#141414' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#262626' : '#E4E4E0'}`,
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="12-Month Expiry Forecast" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data?.forecast || []}>
              <defs>
                <linearGradient id="colorExpiring" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#262626' : '#E4E4E0'} />
              <XAxis dataKey="month" stroke={darkMode ? '#A3A39E' : '#767670'} style={{ fontSize: '11px' }} />
              <YAxis stroke={darkMode ? '#A3A39E' : '#767670'} style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#141414' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#262626' : '#E4E4E0'}`,
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="expiring" stroke="#D97706" fillOpacity={1} fill="url(#colorExpiring)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Historical Expired Stock" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={prepareWasteData(data?.waste)}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#262626' : '#E4E4E0'} />
              <XAxis dataKey="period" stroke={darkMode ? '#A3A39E' : '#767670'} style={{ fontSize: '11px' }} />
              <YAxis stroke={darkMode ? '#A3A39E' : '#767670'} style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#141414' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#262626' : '#E4E4E0'}`,
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="expired" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Summary Ledger */}
      <div
        className={`rounded-xl border p-6 ${
          darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
        }`}
      >
        <h3 className="text-base font-bold mb-4">Inventory Summary Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatItem label="Active Products" value={data?.stats?.activeProducts || 0} darkMode={darkMode} />
          <StatItem label="Avg. Days to Expiry" value={`${data?.stats?.averageDaysToExpiry || 0} days`} darkMode={darkMode} />
          <StatItem label="Total Stock Volume" value={`${data?.stats?.totalQuantity || 0} units`} darkMode={darkMode} />
          <StatItem label="Expired (Last 30d)" value={data?.waste?.expiredLast30Days || 0} darkMode={darkMode} />
        </div>
      </div>
    </Layout>
  );
};

const MetricCard = ({ title, value, icon: Icon, tone, darkMode, subtitle }) => {
  const toneColors = {
    neutral: darkMode ? 'text-[#F5F5F3] bg-[#1A1A1A] border-[#262626]' : 'text-[#111111] bg-[#F3F2EE] border-[#E4E4E0]',
    good: darkMode ? 'text-[#4ADE80] bg-[#0D2116] border-[#19422B]' : 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]',
    warning: darkMode ? 'text-[#FBBF24] bg-[#271A0B] border-[#543813]' : 'text-[#B45309] bg-[#FFFBEB] border-[#FDE68A]',
    critical: darkMode ? 'text-[#F87171] bg-[#2A1212] border-[#5E1A1A]' : 'text-[#B91C1C] bg-[#FEF2F2] border-[#FECACA]'
  };

  return (
    <div
      className={`p-5 rounded-xl border ${
        darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`text-xs font-medium ${darkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}`}>{title}</p>
          <h3 className="tabular-data text-2xl sm:text-3xl font-bold tracking-tight mt-1">{value}</h3>
          {subtitle && (
            <p className={`text-[11px] font-mono mt-1 ${darkMode ? 'text-[#6E6E68]' : 'text-[#767670]'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg border ${toneColors[tone] || toneColors.neutral}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children, darkMode }) => (
  <div
    className={`rounded-xl border p-5 sm:p-6 ${
      darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
    }`}
  >
    <h3 className="text-sm font-bold uppercase tracking-wider text-[#767670] dark:text-[#A3A39E] mb-4">
      {title}
    </h3>
    {children}
  </div>
);

const StatItem = ({ label, value, darkMode }) => (
  <div
    className={`p-4 rounded-lg border ${
      darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-[#FAF9F6] border-[#E4E4E0]'
    }`}
  >
    <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}`}>{label}</p>
    <p className="tabular-data text-xl font-bold">{value}</p>
  </div>
);

const prepareExpiryTrendsData = (trends) => {
  if (!trends) return [];
  return [
    { name: 'Expired', count: trends.expired },
    { name: 'This Week', count: trends.expiringThisWeek },
    { name: 'This Month', count: trends.expiringThisMonth },
    { name: '3 Months', count: trends.expiringNext3Months },
    { name: '6 Months', count: trends.expiringNext6Months },
    { name: 'Healthy', count: trends.healthy }
  ];
};

const prepareWasteData = (waste) => {
  if (!waste) return [];
  return [
    { period: 'Last 7d', expired: waste.expiredLast7Days },
    { period: 'Last 30d', expired: waste.expiredLast30Days },
    { period: 'Last 90d', expired: waste.expiredLast90Days },
    { period: 'Total', expired: waste.totalExpired }
  ];
};

const getHealthLabel = (score) => {
  if (score >= 80) return 'Optimal Rotation';
  if (score >= 60) return 'Good Standing';
  if (score >= 40) return 'Action Recommended';
  return 'Critical Attention';
};

export default Analytics;
