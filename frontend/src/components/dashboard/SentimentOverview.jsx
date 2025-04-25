import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { formatPercentage } from '../../utils/formatters';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentOverview = ({ data }) => {
  const [platform, setPlatform] = useState('all'); // 'all', 'twitter', 'instagram', 'facebook', 'reddit'
  
  if (!data) {
    return <div className="loading-placeholder">Loading sentiment data...</div>;
  }
  
  const filteredData = platform === 'all' ? data.overall : data.platforms[platform];
  
  const chartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          filteredData.positive,
          filteredData.neutral,
          filteredData.negative
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = formatPercentage(value / 
              (filteredData.positive + filteredData.neutral + filteredData.negative));
            return `${label}: ${percentage}`;
          }
        }
      }
    }
  };
  
  const sentimentScore = ((filteredData.positive * 1) + 
                          (filteredData.neutral * 0) + 
                          (filteredData.negative * -1)) / 
                          (filteredData.positive + filteredData.neutral + filteredData.negative);
  
  const sentimentScoreNormalized = ((sentimentScore + 1) / 2) * 100;
  
  // Compare with previous period
  const trendChange = filteredData.previousScore 
    ? sentimentScoreNormalized - filteredData.previousScore 
    : 0;
  
  return (
    <div className="sentiment-overview-container">
      <div className="sentiment-overview-header">
        <h2>Sentiment Overview</h2>
        <div className="platform-selector">
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="all">All Platforms</option>
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="reddit">Reddit</option>
          </select>
        </div>
      </div>
      
      <div className="sentiment-stats">
        <div className="sentiment-score">
          <div className="score-label">Sentiment Score</div>
          <div className="score-value">{sentimentScoreNormalized.toFixed(1)}</div>
          <div className={`score-trend ${trendChange > 0 ? 'positive' : trendChange < 0 ? 'negative' : 'neutral'}`}>
            {trendChange > 0 ? '↑' : trendChange < 0 ? '↓' : '–'} 
            {Math.abs(trendChange).toFixed(1)}%
          </div>
        </div>
        
        <div className="sentiment-volume">
          <div className="volume-label">Total Volume</div>
          <div className="volume-value">
            {(filteredData.positive + filteredData.neutral + filteredData.negative).toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="sentiment-chart">
        <Pie data={chartData} options={chartOptions} />
      </div>
      
      <div className="sentiment-breakdown">
        <div className="sentiment-type positive">
          <span className="sentiment-label">Positive</span>
          <span className="sentiment-percentage">
            {formatPercentage(filteredData.positive / 
              (filteredData.positive + filteredData.neutral + filteredData.negative))}
          </span>
        </div>
        <div className="sentiment-type neutral">
          <span className="sentiment-label">Neutral</span>
          <span className="sentiment-percentage">
            {formatPercentage(filteredData.neutral / 
              (filteredData.positive + filteredData.neutral + filteredData.negative))}
          </span>
        </div>
        <div className="sentiment-type negative">
          <span className="sentiment-label">Negative</span>
          <span className="sentiment-percentage">
            {formatPercentage(filteredData.negative / 
              (filteredData.positive + filteredData.neutral + filteredData.negative))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SentimentOverview;