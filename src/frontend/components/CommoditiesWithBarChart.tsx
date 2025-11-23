import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";
import UpTrend from "./UpTrend";
import DownTrend from "./DownTrend";

// Declare window type for WordPress data
declare global {
  interface Window {
    wordpressPluginBoilerplateFrontend?: {
      apiUrl?: string;
      routePrefix?: string;
    };
  }
}

interface Commodity {
  id: number;
  name: string;
  abbreviation: string;
  prevPrice: number;
  curPrice: number;
}

export default function CommoditiesWithBarChart() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      const wpData = window.wordpressPluginBoilerplateFrontend || {};
      const apiUrl = wpData.apiUrl || "";
      const routePrefix = wpData.routePrefix || "wordpress-plugin-boilerplate/v1";
      const response = await fetch(
        `${apiUrl}${routePrefix}/commodities/get`
      );
      if (response.ok) {
        const data = await response.json();
        setCommodities(data || []);
      }
    } catch (error) {
      console.error("Error fetching commodities:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const calculateTrend = (prev: number, current: number) => {
    if (current > prev) return "up";
    if (current < prev) return "down";
    return "stable";
  };

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "text-green-500";
    if (trend === "down") return "text-red-500";
    return "text-gray-500";
  };

  const generateChartData = (commodity: Commodity) => {
    // Generate last 7 days data for mini chart
    const data = [];
    const days = 7;
    const diff = (Number(commodity.curPrice) - Number(commodity.prevPrice)) / days;
    
    for (let i = 0; i < days; i++) {
      data.push({
        day: i,
        value: Number(commodity.prevPrice) + diff * i,
      });
    }
    return data;
  };

  const getCommodityColor = (index: number) => {
    const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading commodities...</div>
      </div>
    );
  }

  if (commodities.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">No commodities data available.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {commodities.map((commodity, index) => {
        const trend = calculateTrend(commodity.prevPrice, commodity.curPrice);
        const chartData = generateChartData(commodity);
        const color = getCommodityColor(index);

        return (
          <Card key={commodity.id} className="w-full grid grid-cols-3 items-center gap-2 bg-[##FDFDFD] rounded-none shadow-none border border-border">
            <CardHeader className="space-y-0 col-span-2">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-bold tabular-nums">
                  {formatPrice(commodity.curPrice)}
                </span>
                <div className={`flex items-center gap-1 ${getTrendColor(trend)}`}>
                  {trend === "up" && <UpTrend className="h-4 w-4" />}
                  {trend === "down" && <DownTrend className="h-4 w-4" />}
                </div>
              </div>
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {commodity.name}
              </CardTitle>

            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Price",
                    color: color,
                  },
                }}
                className="h-[30px] w-full"
              >
                <BarChart
                  data={chartData}
                  margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                >
                  <XAxis dataKey="day" hide />
                  <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                  <Bar
                    dataKey="value"
                    fill={color}
                    radius={4}
                    fillOpacity={0.6}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value: any) => formatPrice(value)}
                      />
                    }
                    cursor={false}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

