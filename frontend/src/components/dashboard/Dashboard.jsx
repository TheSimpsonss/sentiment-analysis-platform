import { useEffect, useState } from 'react';
import Loading from '../components/common/Loading';
import AlertsWidget from '../components/dashboard/AlertsWidget';
import CompetitorComparison from '../components/dashboard/CompetitorComparison';
import SentimentOverview from '../components/dashboard/SentimentOverview';
import TrendChart from '../components/dashboard/TrendChart';
import { useApi } from '../hooks/useApi';
import { useDashboard } from '../hooks/useDashboard';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d'); // Options: 24h, 7d, 30d, 90d
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const { fetchDashboardData } = useApi();
  const { processDashboardData } = useDashboard();

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDashboardData(timeRange);
        const processedData = processDashboardData(data);
        setDashboardData(processedData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [timeRange, fetchDashboardData, processDashboardData]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Brand Sentiment Dashboard</h1>
        <div className="time-range-selector">
          <button 
            className={timeRange === '24h' ? 'active' : ''} 
            onClick={() => handleTimeRangeChange('24h')}
          >
            24 Hours
          </button>
          <button 
            className={timeRange === '7d' ? 'active' : ''} 
            onClick={() => handleTimeRangeChange('7d')}
          >
            7 Days
          </button>
          <button 
            className={timeRange === '30d' ? 'active' : ''} 
            onClick={() => handleTimeRangeChange('30d')}
          >
            30 Days
          </button>
          <button 
            className={timeRange === '90d' ? 'active' : ''} 
            onClick={() => handleTimeRangeChange('90d')}
          >
            90 Days
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card sentiment-overview">
          <SentimentOverview data={dashboardData?.sentimentOverview} />
        </div>
        
        <div className="dashboard-card trend-chart">
          <TrendChart data={dashboardData?.trendData} timeRange={timeRange} />
        </div>
        
        <div className="dashboard-card competitor-comparison">
          <CompetitorComparison data={dashboardData?.competitorData} />
        </div>
        
        <div className="dashboard-card alerts-widget">
          <AlertsWidget alerts={dashboardData?.recentAlerts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;