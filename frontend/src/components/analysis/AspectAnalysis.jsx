import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    Title,
    Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useApi } from '../../hooks/useApi';
import Alert from '../common/Alert';
import Loading from '../common/Loading';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AspectAnalysis = () => {
  const [aspectData, setAspectData] = useState(null);
  const [selectedAspect, setSelectedAspect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const { fetchAspectAnalysisData } = useApi();

  useEffect(() => {
    const loadAspectData = async () => {
      setLoading(true);
      try {
        const data = await fetchAspectAnalysisData(timeRange);
        setAspectData(data);
        // Set first aspect as default selection
        if (data && data.aspects && data.aspects.length > 0 && !selectedAspect) {
          setSelectedAspect(data.aspects[0].name);
        }
      } catch (err) {
        setError('Failed to load aspect analysis data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAspectData();
  }, [fetchAspectAnalysisData, timeRange]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!aspectData || !aspectData.aspects || aspectData.aspects.length === 0) {
    return <Alert type="info" message="No aspect data available for analysis" />;
  }

  // Prepare chart data for all aspects
  const aspectChartData = {
    labels: aspectData.aspects.map(aspect => aspect.name),
    datasets: [
      {
        label: 'Positive',
        data: aspectData.aspects.map(aspect => aspect.positive),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Neutral',
        data: aspectData.aspects.map(aspect => aspect.neutral),
        backgroundColor: 'rgba(255, 206, 86, 0.7)',
      },
      {
        label: 'Negative',
        data: aspectData.aspects.map(aspect => aspect.negative),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sentiment by Aspect',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  };

  // Get detailed data for selected aspect
  const selectedAspectData = aspectData.aspects.find(a => a.name === selectedAspect);
  
  // Prepare topic distribution for selected aspect
  const topicData = selectedAspectData ? {
    labels: selectedAspectData.topics.map(topic => topic.name),
    datasets: [
      {
        label: 'Topic Mentions',
        data: selectedAspectData.topics.map(topic => topic.count),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  } : null;

  const topicOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Topics for ${selectedAspect}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="aspect-analysis-container">
      <div className="aspect-analysis-header">
        <h2>Aspect-Based Sentiment Analysis</h2>
        <div className="time-selector">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      <div className="aspect-chart-container">
        <Bar data={aspectChartData} options={chartOptions} />
      </div>

      <div className="aspect-selector">
        <h3>Select an aspect for detailed analysis:</h3>
        <div className="aspect-buttons">
          {aspectData.aspects.map(aspect => (
            <button
              key={aspect.name}
              className={selectedAspect === aspect.name ? 'active' : ''}
              onClick={() => setSelectedAspect(aspect.name)}
            >
              {aspect.name}
            </button>
          ))}
        </div>
      </div>

      {selectedAspectData && (
        <div className="aspect-detail">
          <h3>{selectedAspect} Detail</h3>
          
          <div className="aspect-stats">
            <div className="stat-item">
              <div className="stat-label">Mentions</div>
              <div className="stat-value">{selectedAspectData.total_mentions.toLocaleString()}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Positive</div>
              <div className="stat-value positive">{Math.round(selectedAspectData.positive_percentage)}%</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Neutral</div>
              <div className="stat-value neutral">{Math.round(selectedAspectData.neutral_percentage)}%</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Negative</div>
              <div className="stat-value negative">{Math.round(selectedAspectData.negative_percentage)}%</div>
            </div>
          </div>

          <div className="topic-chart-container">
            <Bar data={topicData} options={topicOptions} />
          </div>

          <div className="example-mentions">
            <h4>Example Mentions</h4>
            <div className="mention-tabs">
              <button className="active">Positive</button>
              <button>Neutral</button>
              <button>Negative</button>
            </div>
            <div className="mention-list">
              {selectedAspectData.example_mentions.positive.map((mention, index) => (
                <div key={index} className="mention-item positive">
                  <div className="mention-text">{mention.text}</div>
                  <div className="mention-source">
                    <span className="platform">{mention.platform}</span>
                    <span className="date">{mention.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AspectAnalysis;