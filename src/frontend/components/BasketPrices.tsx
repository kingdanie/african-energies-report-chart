import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { format, subMonths, subYears, startOfYear, parseISO } from "date-fns";

// Declare window type for WordPress data
declare global {
  interface Window {
    wordpressPluginBoilerplateFrontend?: {
      apiUrl?: string;
      routePrefix?: string;
    };
  }
}

interface BasketPrice {
  id: number;
  day: string;
  setScore: number;
}

type TimeRange = "1m" | "3m" | "6m" | "ytd" | "1y" | "all";

export default function BasketPrices() {
  const [basketPrices, setBasketPrices] = useState<BasketPrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<BasketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [chartReady, setChartReady] = useState(false);
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    fetchBasketPrices();
  }, []);

  useEffect(() => {
    filterByTimeRange();
  }, [basketPrices, timeRange]);

  useEffect(() => {
    // Ensure Highcharts is loaded before rendering
    if (typeof Highcharts !== "undefined" && basketPrices.length > 0) {
      setChartReady(true);
    }
  }, [basketPrices]);

  const fetchBasketPrices = async () => {
    try {
      const wpData = window.wordpressPluginBoilerplateFrontend || {};
      const apiUrl = wpData.apiUrl || "";
      const routePrefix = wpData.routePrefix || "wordpress-plugin-boilerplate/v1";
      const response = await fetch(
        `${apiUrl}${routePrefix}/basket-prices/get?orderby=day&order=asc`
      );
      if (response.ok) {
        const data = await response.json();
        setBasketPrices(data || []);
      }
    } catch (error) {
      console.error("Error fetching basket prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterByTimeRange = () => {
    if (basketPrices.length === 0) {
      setFilteredPrices([]);
      return;
    }

    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "1m":
        startDate = subMonths(now, 1);
        break;
      case "3m":
        startDate = subMonths(now, 3);
        break;
      case "6m":
        startDate = subMonths(now, 6);
        break;
      case "ytd":
        startDate = startOfYear(now);
        break;
      case "1y":
        startDate = subYears(now, 1);
        break;
      default:
        setFilteredPrices(basketPrices);
        return;
    }

    const filtered = basketPrices.filter((price) => {
      const priceDate = new Date(price.day);
      return priceDate >= startDate && priceDate <= now;
    });

    setFilteredPrices(filtered);
  };

  const formatFullDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "d MMM yyyy");
    } catch {
      return dateString;
    }
  };

  const getTimeframeLabel = () => {
    const pricesToUse = timeRange === "all" ? basketPrices : filteredPrices;
    if (pricesToUse.length === 0) return "";
    const first = pricesToUse[0];
    const last = pricesToUse[pricesToUse.length - 1];
    return `${formatFullDate(first.day)} → ${formatFullDate(last.day)}`;
  };

  const prepareChartData = (prices: BasketPrice[]) => {
    return prices.map((price) => [new Date(price.day).getTime(), Number(price.setScore)]);
  };

  const chartData = prepareChartData(
    timeRange === "all" ? basketPrices : filteredPrices
  );

  // Highcharts configuration
  const chartOptions: Highcharts.Options = {
    chart: {
      type: "line",
      height: 450,
      spacing: [20, 20, 100, 20], // Top, right, bottom (for navigator), left
    },
    title: {
      text: undefined,
    },
    xAxis: {
      type: "datetime",
      labels: {
        format: "{value:%d %b}",
      },
      gridLineWidth: 0,
      lineWidth: 0,
      tickWidth: 0,
    },
    yAxis: {
      title: {
        text: "OPEC Basket Price",
        rotation: 0,
        align: "high",
        offset: 0,
        style: {
          color: "#666",
        },
        y: -10,
        x: -10,
      },
      labels: {
        format: "${value}",
      },
      gridLineDashStyle: "Dash",
      gridLineColor: "#e5e7eb",
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        const point = this.points?.[0];
        if (!point) return "";
        const date = formatFullDate(new Date(point.x as number).toISOString());
        const value = `$${(point.y as number).toFixed(2)}`;
        return `<div><strong>${date}</strong><br/>OPEC Basket Price: ${value}</div>`;
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 4,
            },
          },
        },
        lineWidth: 2,
        color: "#2563eb",
      },
    },
    series: [
      {
        name: "OPEC Basket Price",
        type: "line",
        data: chartData,
      },
    ],
    credits: {
      enabled: false,
    },
    navigator: {
      enabled: true,
      height: 100,
      xAxis: {
        labels: {
          enabled: false,
        },
      },
      series: {
        type: "line",
        color: "#2563eb",
        lineWidth: 1,
        fillOpacity: 0.2,
      },
      handles: {
        backgroundColor: "#fff",
        borderColor: "#2563eb",
      },
      outlineColor: "#2563eb",
      maskFill: "rgba(37, 99, 235, 0.1)",
    },
    rangeSelector: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
  };

  // Update chart when data changes
  useEffect(() => {
    if (chartRef.current && chartRef.current.chart && chartReady) {
      const chart = chartRef.current.chart;
      const series = chart.series[0];
      if (series && chartData.length > 0) {
        series.setData(chartData, true);
      }
    }
  }, [chartData, timeRange, chartReady]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading basket prices...</div>
      </div>
    );
  }

  if (basketPrices.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">No basket price data available.</div>
      </div>
    );
  }

  if (!chartReady || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Preparing chart...</div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>OPEC Basket Price</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={timeRange === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("all")}
              >
                All
              </Button>
              <Button
                variant={timeRange === "1y" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("1y")}
              >
                1y
              </Button>
              <Button
                variant={timeRange === "ytd" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("ytd")}
              >
                YTD
              </Button>
              <Button
                variant={timeRange === "6m" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("6m")}
              >
                6m
              </Button>
              <Button
                variant={timeRange === "3m" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("3m")}
              >
                3m
              </Button>
              <Button
                variant={timeRange === "1m" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("1m")}
              >
                1m
              </Button>
            </div>
          </div>
          {chartData.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {getTimeframeLabel()}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {typeof Highcharts !== "undefined" && (
            <HighchartsReact
              ref={chartRef}
              highcharts={Highcharts}
              options={chartOptions}
              constructorType="stockChart"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
