import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Overview } from "@/components/dashboard/overview";
import { Search } from "@/components/dashboard/search";
import TeamSwitcher from "@/components/dashboard/team-switcher";
import { Globe, Package, TrendingUp, Activity, ChevronDown, Check, Info, Code, BookOpen } from "lucide-react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { format, subMonths, subYears, startOfYear, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

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
              <TabsTrigger value="analytics">
                Charts
              </TabsTrigger>
              <TabsTrigger value="reports">
                Plugin Info
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
            <TabsContent value="analytics" className="space-y-4">
              <DashboardChart apiUrl={apiUrl} routePrefix={routePrefix} />
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <PluginInfo />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

// Dashboard Chart Component (similar to frontend)
function DashboardChart({ apiUrl, routePrefix }) {
  const [basketPrices, setBasketPrices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");
  const [chartReady, setChartReady] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const chartRef = useRef(null);

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
    let startDate;

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

  const formatFullDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "d MMM yyyy");
    } catch {
      return dateString;
    }
  };

  const getLabelInfo = (labelKey) => {
    return labels.find((l) => l.label_key === labelKey) || {
      name: labelKey,
      color: "#2563eb",
    };
  };

  const prepareChartData = (prices) => {
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

  const chartOptions = {
    chart: {
      type: "line",
      height: 450,
      spacing: [20, 20, 100, 20],
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
          new Date(this.points[0].x).toISOString()
        );
        let tooltip = `<div><strong>${date}</strong><br/>`;
        this.points.forEach((point) => {
          const value = point.y.toFixed(2);
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
        data: allChartData.label1,
        color: chartData.label1Info.color || "#10b981",
        lineWidth: 1,
      },
    },
    rangeSelector: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
  };

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

  const selectedCountryName =
    countries.find((c) => c.id === selectedCountry)?.name || "";

  if (countries.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">No countries available.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle>Basket Prices Chart - {selectedCountryName}</CardTitle>
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={filterOpen}
                  className="w-[200px] justify-between"
                >
                  {selectedCountryName || "Select Country"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.id}
                          value={country.id.toString()}
                          onSelect={() => {
                            setSelectedCountry(country.id);
                            setFilterOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCountry === country.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {country.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
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
  );
}

// Plugin Info Component
function PluginInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            <CardTitle>About AER Charts Plugin</CardTitle>
          </div>
          <CardDescription>
            Information about the plugin, shortcodes, and how to use the different sections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Plugin Overview</h3>
            <p className="text-sm text-muted-foreground">
              AER Charts is a WordPress plugin designed to display and manage commodity prices and basket prices 
              for different countries. The plugin allows you to track commodities, manage countries, and visualize 
              basket price trends over time.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Code className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Shortcodes</h3>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Commodities Shortcode</h4>
                <code className="block bg-muted p-2 rounded text-sm mb-2">
                  [aer_commodities]
                </code>
                <p className="text-sm text-muted-foreground">
                  Displays a grid of commodity cards showing current prices, previous prices, and trend indicators. 
                  Add this shortcode to any page or post where you want to display commodities.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Basket Prices Shortcode</h4>
                <code className="block bg-muted p-2 rounded text-sm mb-2">
                  [aer_basket_prices]
                </code>
                <p className="text-sm text-muted-foreground">
                  Displays an interactive Highcharts Stock chart showing basket prices over time. Users can select 
                  a country from the dropdown and view price trends with time range filters (1m, 3m, 6m, YTD, 1y, All). 
                  The chart displays three data points per country per date.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4" />
              <h3 className="text-lg font-semibold">How to Use</h3>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Countries Section</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Navigate to <strong>AER Charts → Countries</strong> in the admin menu</li>
                  <li>Add new countries by clicking the "Add Country" button</li>
                  <li>Edit or delete existing countries using the action buttons</li>
                  <li>Filter countries by status (All, Active, Inactive) using the dropdown</li>
                  <li>Countries can be set as active or inactive - only active countries appear in the frontend dropdown</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Basket Prices Section</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Navigate to <strong>AER Charts → Basket Prices</strong> in the admin menu</li>
                  <li>Filter basket prices by country using the dropdown filter</li>
                  <li>Add new basket price entries by clicking "Add Basket Price"</li>
                  <li>Each entry requires: Country, Date, and three data point values (Label 1, Label 2, Label 3)</li>
                  <li>Edit or delete existing entries using the action buttons</li>
                  <li>Manage data point labels (names and colors) in the "Data Point Labels" section at the bottom</li>
                  <li>Label changes reflect globally across all charts and displays</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Commodities Section</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Navigate to <strong>AER Charts → Commodities</strong> in the admin menu</li>
                  <li>Add new commodities with name, abbreviation, previous price, and current price</li>
                  <li>Edit or delete existing commodities using the action buttons</li>
                  <li>Commodities are displayed in a card grid on the frontend using the shortcode</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">💡 Tips</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>Ensure countries are set to "Active" for them to appear in frontend dropdowns</li>
              <li>Data point labels can be customized (e.g., "Crudeoil" → "Crude Oil") and changes apply everywhere</li>
              <li>Basket prices require at least one country to be added before entries can be created</li>
              <li>Use the Charts tab in the dashboard to preview how the frontend chart will look</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
