import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Overview } from "@/components/dashboard/overview";
import { Search } from "@/components/dashboard/search";
import TeamSwitcher from "@/components/dashboard/team-switcher";
import { Globe, Package, TrendingUp, Activity } from "lucide-react";

export default function DashboardPage() {
  const wpData = window.wordpressPluginBoilerplate || {};
  const apiUrl = wpData.apiUrl || "";
  const routePrefix = wpData.routePrefix || "wordpress-plugin-boilerplate/v1";

  const [stats, setStats] = useState({
    totalCountries: 0,
    activeCountries: 0,
    inactiveCountries: 0,
    totalCommodities: 0,
    totalBasketPrices: 0,
    recentBasketPrices: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [countriesRes, commoditiesRes, basketPricesRes] = await Promise.all([
        fetch(`${apiUrl}${routePrefix}/countries/get?active_only=false`),
        fetch(`${apiUrl}${routePrefix}/commodities/get`),
        fetch(`${apiUrl}${routePrefix}/basket-prices/get?limit=10&orderby=day&order=desc`),
      ]);

      const countries = countriesRes.ok ? await countriesRes.json() : [];
      const commodities = commoditiesRes.ok ? await commoditiesRes.json() : [];
      const basketPrices = basketPricesRes.ok ? await basketPricesRes.json() : [];

      // Calculate stats
      const activeCountries = countries.filter((c) => {
        return c.is_active === true || c.is_active === 1;
      }).length;
      const inactiveCountries = countries.length - activeCountries;

      // Get total basket prices count (we might need a separate endpoint for this)
      const allBasketPricesRes = await fetch(`${apiUrl}${routePrefix}/basket-prices/get`);
      const allBasketPrices = allBasketPricesRes.ok ? await allBasketPricesRes.json() : [];

      setStats({
        totalCountries: countries.length,
        activeCountries,
        inactiveCountries,
        totalCommodities: commodities.length || 0,
        totalBasketPrices: allBasketPrices.length || 0,
        recentBasketPrices: basketPrices.slice(0, 5) || [],
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="hidden dark:bg-gray-900 flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl dark:text-white font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button onClick={fetchDashboardStats} variant="outline">
                Refresh
              </Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Countries
                    </CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "..." : stats.totalCountries}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.activeCountries} active, {stats.inactiveCountries} inactive
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Countries
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "..." : stats.activeCountries}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.totalCountries > 0 
                        ? `${Math.round((stats.activeCountries / stats.totalCountries) * 100)}% of total`
                        : "No countries yet"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Commodities
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "..." : stats.totalCommodities}</div>
                    <p className="text-xs text-muted-foreground">
                      Commodities tracked
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Basket Price Entries
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "..." : stats.totalBasketPrices}</div>
                    <p className="text-xs text-muted-foreground">
                      Total price data points
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Price Trends Overview</CardTitle>
                    <CardDescription>
                      Basket price trends across all countries
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Basket Prices</CardTitle>
                    <CardDescription>
                      Latest {stats.recentBasketPrices.length} basket price entries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-4 text-muted-foreground">Loading...</div>
                    ) : stats.recentBasketPrices.length > 0 ? (
                      <div className="space-y-4">
                        {stats.recentBasketPrices.map((price, index) => {
                          const priceData = price || {};
                          return (
                            <div key={priceData.id || index} className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">
                                  {priceData.country?.name || `Country #${priceData.country_id || 'N/A'}`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {priceData.day ? new Date(priceData.day).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {priceData.value_label_1 ? priceData.value_label_1.toLocaleString() : "N/A"}
                                </p>
                                <p className="text-xs text-muted-foreground">Label 1</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No basket prices found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
