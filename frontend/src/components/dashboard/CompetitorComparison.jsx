import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CompetitorComparison = ({ data }) => {
  const [metric, setMetric] = useState('sentiment_score'); // 'sentiment_score', 'volume', 'engagement'
  
  if (!data || !data.competitors || !data.timeline) {
    return <div className="loading-placeholder">Loading competitor data...</div>;
  }
  
  // Get list of all competitors plus own brand
  const competitors = ['Your Brand', ...data.competitors.map(comp => comp.name)];
  
  // Prepare colors for each competitor
  const competitorColors = {
    'Your Brand': {
      line: 'rgba(75, 192, 192, 1)',
      fill: 'rgba(75, 192, 192, 0.1)'
    }
  };
  
  data.competitors.forEach((comp, index) => {
    const hue = (index * 137) % 360; // Generate distinct colors
    competitorColors[comp.name] = {
      line: `hsl(${hue}, 70%, 50%)`,
      fill: `hsla(${hue}, 70%, 50%, 0.1)`
    };
  });
  
  // Generate chart data based on selected metric
  const chartData = {
    labels: data.timeline.map(point => point.date),
    datasets: competitors.map(competitor => {
      const color = competitorColors[competitor];
      
      // Get the data points for this competitor
      let dataPoints;
      if (competitor === 'Your Brand') {
        dataPoints = data.timeline.map(point => point.own[metric]);
      } else {
        const compData = data.competitors.find(c => c.name === competitor);
        dataPoints = data.timeline.map(point => {
          const compPoint = point.competitors.find(c => c.name === competitor);
          return compPoint ? compPoint[metric] : null;
        });
      }
      
      return {
        label: competitor,
        data: dataPoints,
        borderColor: color.line,
        backgroundColor: color.fill,
        fill: metric === 'sentiment_score' ? 'origin' : false,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5
      };
    })
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: getMetricTitle(metric)
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            let value = context.raw;
            
            // Format based on metric type
            if (metric === 'sentiment_score') {
              value = value.toFixed(2);
            } else if (metric === 'volume') {
              value = value.toLocaleString();
            } else if (metric === 'engagement') {
              value = value.toLocaleString();
            }
            
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: metric !== 'sentiment_score',
        suggestedMin: metric === 'sentiment_score' ? -1 : 0,
        suggestedMax: metric === 'sentiment_score' ? 1 : undefined,
        title: {
          display: true,
          text: getAxisTitle(metric)
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };
  
  // Get titles based on selected metric
  function getMetricTitle(metricType) {
    switch(metricType) {
      case 'sentiment_score':
        return 'Sentiment Score Comparison';
      case 'volume':
        return 'Mention Volume Comparison';
      case 'engagement':
        return 'Engagement Comparison';
      default:
        return 'Competitor Comparison';
    }
  }
  
  function getAxisTitle(metricType) {
    switch(metricType) {
      case 'sentiment_score':
        return 'Sentiment Score (-1 to 1)';
      case 'volume':
        return 'Number of Mentions';
      case 'engagement':
        return 'Engagement Count';
      default:
        return 'Value';
    }
  }
  
  // Calculate summary statistics
  const summaryData = competitors.map(competitor => {
    let latestValue, changeValue, changePercent;
    
    if (competitor === 'Your Brand') {
      const latest = data.timeline[data.timeline.length - 1].own[metric];
      const previous = data.timeline[0].own[metric];
      latestValue = latest;
      changeValue = latest - previous;
      changePercent = previous !== 0 ? ((latest - previous) / Math.abs(previous)) * 100 : 0;
    } else {
      const compData = data.competitors.find(c => c.name === competitor);
      if (compData) {
        const latest = data.timeline[data.timeline.length - 1].competitors.find(c => c.name === competitor)?.[metric] || 0;
        const previous = data.timeline[0].competitors.find(c => c.name === competitor)?.[metric] || 0;
        latestValue = latest;
        changeValue = latest - previous;
        changePercent = previous !== 0 ? ((latest - previous) / Math.abs(previous)) * 100 : 0;
      }
    }
    
    return {
      name: competitor,
      latestValue,
      changeValue,
      changePercent
    };
  });
  
  return (
    <div className="competitor-comparison-container">
      <div className="comparison-header">
        <h2>Competitor Comparison</h2>
        <div className="metric-selector">
          <button 
            className={metric === 'sentiment_score' ? 'active' : ''}
            onClick={() => setMetric('sentiment_score')}
          >
            Sentiment
          </button>
          <button 
            className={metric === 'volume' ? 'active' : ''}
            onClick={() => setMetric('volume')}
          >
            Volume
          </button>
          <button 
            className={metric === 'engagement' ? 'active' : ''}
            onClick={() => setMetric('engagement')}
          >
            Engagement
          </button>
        </div>
      </div>
      
      <div className="comparison-chart">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className="comparison-summary">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Competitor</th>
              <th>Current {getMetricLabel(metric)}</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map(competitor => (
              <tr key={competitor.name}>
                <td>{competitor.name}</td>
                <td>{formatMetricValue(competitor.latestValue, metric)}</td>
                <td className={getChangeClass(competitor.changeValue)}>
                  {formatChange(competitor.changeValue, competitor.changePercent, metric)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper functions
function getMetricLabel(metric) {
  switch(metric) {
    case 'sentiment_score':
      return 'Score';
    case 'volume':
      return 'Volume';
    case 'engagement':
      return 'Engagement';
    default:
      return 'Value';
  }
}

function formatMetricValue(value, metric) {
  if (value === undefined || value === null) return 'N/A';
  
  switch(metric) {
    case 'sentiment_score':
      return value.toFixed(2);
    case 'volume':
    case 'engagement':
      return value.toLocaleString();
    default:
      return value;
  }
}

function getChangeClass(change) {
  if (change > 0) return 'positive-change';
  if (change < 0) return 'negative-change';
  return 'neutral-change';
}

function formatChange(changeValue, changePercent, metric) {
  if (changeValue === undefined || changeValue === null) return 'N/A';
  
  const arrow = changeValue > 0 ? '↑' : changeValue < 0 ? '↓' : '–';
  
  switch(metric) {
    case 'sentiment_score':
      return `${arrow} ${Math.abs(changeValue).toFixed(2)} (${Math.abs(changePercent).toFixed(1)}%)`;
    case 'volume':
    case 'engagement':
      return `${arrow} ${Math.abs(changeValue).toLocaleString()} (${Math.abs(changePercent).toFixed(1)}%)`;
    default:
      return `${arrow} ${Math.abs(changeValue)} (${Math.abs(changePercent).toFixed(1)}%)`;
  }
}

export default CompetitorComparison;