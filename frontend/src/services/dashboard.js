import api from "./api";

const dashboardService = {
  getSentimentOverview: async (filters = {}) => {
    const response = await api.get("/dashboard/sentiment-overview", {
      params: filters,
    });
    return response.data;
  },

  getTrendData: async (timeframe = "week", platforms = []) => {
    const response = await api.get("/dashboard/trends", {
      params: { timeframe, platforms: platforms.join(",") },
    });
    return response.data;
  },

  getAspectAnalysis: async (filters = {}) => {
    const response = await api.get("/analysis/aspects", { params: filters });
    return response.data;
  },

  getCompetitorComparison: async (competitors = [], metrics = []) => {
    const response = await api.get("/dashboard/competitors", {
      params: {
        competitors: competitors.join(","),
        metrics: metrics.join(","),
      },
    });
    return response.data;
  },

  getAlerts: async () => {
    const response = await api.get("/alerts/recent");
    return response.data;
  },
};

export default dashboardService;
