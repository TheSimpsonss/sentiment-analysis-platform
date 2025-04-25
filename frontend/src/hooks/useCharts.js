import { useState } from "react";

export const useCharts = () => {
  const [chartColors, setChartColors] = useState({
    positive: "#4CAF50",
    neutral: "#9E9E9E",
    negative: "#F44336",
    platforms: {
      twitter: "#1DA1F2",
      instagram: "#E1306C",
      facebook: "#4267B2",
      reddit: "#FF5700",
    },
  });

  const formatSentimentData = (data) => {
    if (!data) return [];

    return [
      {
        name: "Positive",
        value: data.positive || 0,
        color: chartColors.positive,
      },
      {
        name: "Neutral",
        value: data.neutral || 0,
        color: chartColors.neutral,
      },
      {
        name: "Negative",
        value: data.negative || 0,
        color: chartColors.negative,
      },
    ];
  };

  const formatTrendData = (data) => {
    if (!data || !data.length) return [];

    return data.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      positive: item.sentiment.positive || 0,
      neutral: item.sentiment.neutral || 0,
      negative: item.sentiment.negative || 0,
    }));
  };

  const formatAspectData = (data) => {
    if (!data || !data.aspects) return [];

    return Object.entries(data.aspects).map(([aspect, scores]) => ({
      aspect,
      positive: scores.positive || 0,
      neutral: scores.neutral || 0,
      negative: scores.negative || 0,
    }));
  };

  const formatCompetitorData = (data) => {
    if (!data || !data.competitors) return [];

    return data.competitors.map((comp) => ({
      name: comp.name,
      sentiment_score: comp.sentiment_score,
      engagement: comp.engagement,
      volume: comp.volume,
    }));
  };

  return {
    chartColors,
    formatSentimentData,
    formatTrendData,
    formatAspectData,
    formatCompetitorData,
  };
};
