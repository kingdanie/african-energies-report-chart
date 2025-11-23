import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface Country {
  id: number;
  name: string;
  code?: string;
  is_active: boolean;
}

interface BasketPriceLabel {
  id: number;
  label_key: string;
  name: string;
  color?: string;
  display_order: number;
}

interface BasketPrice {
  id: number;
  country_id: number;
  day: string;
  value_label_1: number;
  value_label_2: number;
  value_label_3: number;
}

type TimeRange = "1m" | "3m" | "6m" | "ytd" | "1y" | "all";

export default function BasketPrices() {
  const wpData = window.wordpressPluginBoilerplateFrontend || {};
  const apiUrl = wpData.apiUrl || "";
  const routePrefix = wpData.routePrefix || "african-energy-reports-plugin/v1";

  const [basketPrices, setBasketPrices] = useState<BasketPrice[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [labels, setLabels] = useState<BasketPriceLabel[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [filteredPrices, setFilteredPrices] = useState<BasketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [chartReady, setChartReady] = useState(false);
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    fetchCountries();
    fetchLabels();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchBasketPrices();
    }
  }, [selectedCountry]);

  useEffect(() => {
    filterByTimeRange();
  }, [basketPrices, timeRange]);

  useEffect(() => {
    // Ensure Highcharts is loaded before rendering
    if (typeof Highcharts !== "undefined" && filteredPrices.length > 0) {
      setChartReady(true);
    }
  }, [filteredPrices]);

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        `${apiUrl}${routePrefix}/countries/get?active_only=true&orderby=display_order&order=asc`
      );
      if (response.ok) {
        const data = await response.json();
        setCountries(data || []);
        // Auto-select first country if available
        if (data && data.length > 0 && !selectedCountry) {
          setSelectedCountry(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchLabels = async () => {
    try {
      const response = await fetch(
        `${apiUrl}${routePrefix}/basket-price-labels/get`
      );
      if (response.ok) {
        const data = await response.json();
        setLabels(data || []);
      }
    } catch (error) {
      console.error("Error fetching labels:", error);
    }
  };

  const fetchBasketPrices = async () => {
    if (!selectedCountry) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${apiUrl}${routePrefix}/basket-prices/get?country_id=${selectedCountry}&orderby=day&order=asc`
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

  const getLabelInfo = (labelKey: string) => {
    return labels.find((l) => l.label_key === labelKey) || {
      name: labelKey,
      color: "#2563eb",
    };
  };

  const prepareChartData = (prices: BasketPrice[]) => {
    const label1 = getLabelInfo("label_1");
    const label2 = getLabelInfo("label_2");
    const label3 = getLabelInfo("label_3");

    return {
      label1: prices.map((price) => [
        new Date(price.day).getTime(),
        Number(price.value_label_1),
      ]),
      label2: prices.map((price) => [
        new Date(price.day).getTime(),
        Number(price.value_label_2),
      ]),
      label3: prices.map((price) => [
        new Date(price.day).getTime(),
        Number(price.value_label_3),
      ]),
      label1Info: label1,
      label2Info: label2,
      label3Info: label3,
    };
  };

  const chartData = prepareChartData(
    timeRange === "all" ? basketPrices : filteredPrices
  );

  const allChartData = prepareChartData(basketPrices);

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
        text: "Price",
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
        format: "{value:,.0f}",
      },
      gridLineDashStyle: "Dash",
      gridLineColor: "#e5e7eb",
    },
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        if (!this.points || this.points.length === 0) return "";
        const date = formatFullDate(
          new Date(this.points[0].x as number).toISOString()
        );
        let tooltip = `<div><strong>${date}</strong><br/>`;
        this.points.forEach((point: any) => {
          const value = (point.y as number).toLocaleString();
          tooltip += `${point.series.name}: ${value}<br/>`;
        });
        tooltip += "</div>";
        return tooltip;
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
      },
    },
    series: [
      {
        name: chartData.label1Info.name,
        type: "line",
        data: chartData.label1,
        color: chartData.label1Info.color || "#10b981",
      },
      {
        name: chartData.label2Info.name,
        type: "line",
        data: chartData.label2,
        color: chartData.label2Info.color || "#3b82f6",
      },
      {
        name: chartData.label3Info.name,
        type: "line",
        data: chartData.label3,
        color: chartData.label3Info.color || "#6366f1",
      },
    ] as Highcharts.SeriesOptionsType[],
    credits: {
      enabled: false,
    },
    navigator: {
      enabled: true,
      height: 100,
      xAxis: {
        labels: {
          enabled: true,
        },
      },
      series: {
        type: "line",
        data: allChartData.label1,
        color: chartData.label1Info.color || "#10b981",
        lineWidth: 1,
      },
      handles: {
        backgroundColor: "#fff",
        borderColor: "#2563eb",
      },
      outlineColor: "#2563eb",
      maskFill: "rgba(37, 99, 235, 0.1)",
    },
    rangeSelector: {
      enabled: true,
    },
    scrollbar: {
      enabled: false,
    },
  };

  // Update chart when data changes
  useEffect(() => {
    if (chartRef.current && chartRef.current.chart && chartReady) {
      const chart = chartRef.current.chart;
      const series = chart.series;
      if (series && series.length >= 3 && chartData.label1.length > 0) {
        series[0].setData(chartData.label1, true);
        series[1].setData(chartData.label2, true);
        series[2].setData(chartData.label3, true);
      }
    }
  }, [chartData, timeRange, chartReady, selectedCountry]);

  if (loading && !selectedCountry) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">No countries available.</div>
      </div>
    );
  }

  if (!selectedCountry) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Please select a country.</div>
      </div>
    );
  }

  const selectedCountryName =
    countries.find((c) => c.id === selectedCountry)?.name || "";

  return (
    <div className="w-full space-y-6">
      <Card className="rounded-none  shadow-none border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Basket Prices - {selectedCountryName}</CardTitle>
            </div>
              <Select
                value={selectedCountry.toString()}
                onValueChange={(value) => setSelectedCountry(parseInt(value))}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
           
          </div>
          {chartData.label1.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {getTimeframeLabel()}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {chartReady && chartData.label1.length > 0 && typeof Highcharts !== "undefined" && (
            <HighchartsReact
              ref={chartRef}
              highcharts={Highcharts}
              options={chartOptions}
              constructorType="stockChart"
            />
          )}
          {!loading && chartData.label1.length === 0 && (
            <div className="flex items-center justify-center h-[450px]">
              <div className="text-muted-foreground">
                No basket price data available for this country.
              </div>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center h-[450px]">
              <div className="text-muted-foreground">Loading chart data...</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
