import { useCallback, useEffect, useState } from "react";
import dashboardService from "../services/dashboard";
import useApi from "./useApi";

export const useDashboard = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [platforms, setPlatforms] = useState([
    "twitter",
    "instagram",
    "facebook",
  ]);
  const [competitors, setCompetitors] = useState([]);

  const sentimentApi = useApi(dashboardService.getSentimentOverview);
  const trendsApi = useApi(dashboardService.getTrendData);
  const aspectsApi = useApi(dashboardService.getAspectAnalysis);
  const competitorsApi = useApi(dashboardService.getCompetitorComparison);
  const alertsApi = useApi(dashboardService.getAlerts);

  const fetchDashboardData = useCallback(async () => {
    try {
      await Promise.all([
        sentimentApi.execute({ timeframe, platforms }),
        trendsApi.execute(timeframe, platforms),
        aspectsApi.execute({ timeframe, platforms }),
        competitorsApi.execute(competitors, ["sentiment_score", "engagement"]),
        alertsApi.execute(),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [timeframe, platforms, competitors]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    sentimentData: sentimentApi.data,
    trendsData: trendsApi.data,
    aspectsData: aspectsApi.data,
    competitorsData: competitorsApi.data,
    alertsData: alertsApi.data,
    loading:
      sentimentApi.loading ||
      trendsApi.loading ||
      aspectsApi.loading ||
      competitorsApi.loading ||
      alertsApi.loading,
    error:
      sentimentApi.error ||
      trendsApi.error ||
      aspectsApi.error ||
      competitorsApi.error ||
      alertsApi.error,
    timeframe,
    setTimeframe,
    platforms,
    setPlatforms,
    competitors,
    setCompetitors,
    refreshData: fetchDashboardData,
  };
};
