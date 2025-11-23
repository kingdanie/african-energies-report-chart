import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Commodities() {
  const wpData = window.wordpressPluginBoilerplateFrontend || {};
  const apiUrl = wpData.apiUrl || "";
  const routePrefix = wpData.routePrefix || "african-energy-reports-plugin/v1";

  const { data: commodities = [], isLoading: loading } = useQuery({
    queryKey: ["commodities"],
    queryFn: async () => {
      const response = await fetch(
        `${apiUrl}${routePrefix}/commodities/get`
      );
      if (!response.ok) throw new Error("Failed to fetch commodities");
      const data = await response.json();
      return data || [];
    },
  });

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {commodities.map((commodity, index) => {
        const trend = calculateTrend(commodity.prevPrice, commodity.curPrice);

        return (
          <Card key={commodity.id} className="w-full bg-[##FDFDFD] rounded-none shadow-none border border-border">
            <CardHeader className="space-y-0">
              <CardTitle className="flex items-baseline gap-2">
                <span className="text-xl font-bold tabular-nums">
                  {formatPrice(commodity.curPrice)}
                </span>
                <div className={`flex items-center gap-1 ${getTrendColor(trend)}`}>
                  {trend === "up" && <UpTrend className="h-4 w-4" />}
                  {trend === "down" && <DownTrend className="h-4 w-4" />}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-sm font-normal text-muted-foreground">
                {commodity.name}  ({commodity.abbreviation})
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

