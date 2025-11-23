import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    wordpressPluginBoilerplate?: {
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
  id?: number;
  country_id: number;
  day: string;
  value_label_1: number;
  value_label_2: number;
  value_label_3: number;
  country?: Country;
}


const wpData = window.wordpressPluginBoilerplate || {};
const apiUrl = wpData.apiUrl;
const routePrefix = wpData.routePrefix;
export default function BasketPricesPage() {

  const [basketPrices, setBasketPrices] = useState<BasketPrice[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [labels, setLabels] = useState<BasketPriceLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<number | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBasketPrice, setEditingBasketPrice] = useState<BasketPrice | null>(null);
  const [formData, setFormData] = useState<BasketPrice>({
    country_id: 0,
    day: "",
    value_label_1: 0,
    value_label_2: 0,
    value_label_3: 0,
  });

  useEffect(() => {
    fetchCountries();
    fetchLabels();
    fetchBasketPrices();
  }, []);

  useEffect(() => {
    fetchBasketPrices();
  }, [selectedCountry]);

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        `${apiUrl}${routePrefix}/countries/get?active_only=true&orderby=display_order&order=asc`
      );
      if (response.ok) {
        const data = await response.json();
        setCountries(data || []);
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
    try {
      setLoading(true);
      let url = `${apiUrl}${routePrefix}/basket-prices/get?orderby=day&order=desc`;
      if (selectedCountry !== "all") {
        url += `&country_id=${selectedCountry}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBasketPrices(data || []);
      }
    } catch (error) {
      console.error("Error fetching basket prices:", error);
      toast.error("Failed to fetch basket prices");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = editingBasketPrice
        ? `${apiUrl}${routePrefix}/basket-prices/update`
        : `${apiUrl}${routePrefix}/basket-prices/create`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: editingBasketPrice?.id,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success(result.message);
        setIsDialogOpen(false);
        resetForm();
        fetchBasketPrices();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save basket price");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this basket price?")) return;

    try {
      const response = await fetch(
        `${apiUrl}${routePrefix}/basket-prices/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        toast.success(result.message);
        fetchBasketPrices();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete basket price");
    }
  };

  const handleEdit = (basketPrice: BasketPrice) => {
    setEditingBasketPrice(basketPrice);
    setFormData(basketPrice);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      country_id: countries.length > 0 ? countries[0].id : 0,
      day: "",
      value_label_1: 0,
      value_label_2: 0,
      value_label_3: 0,
    });
    setEditingBasketPrice(null);
  };

  const openDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getLabelName = (labelKey: string) => {
    const label = labels.find((l) => l.label_key === labelKey);
    return label ? label.name : labelKey;
  };

  const filteredPrices = selectedCountry === "all" 
    ? basketPrices 
    : basketPrices.filter((price) => price.country_id === selectedCountry);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Basket Prices</h2>
        <div className="flex items-center gap-4">
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={filterOpen}
                className="w-[200px] justify-between"
              >
                {selectedCountry === "all"
                  ? "All Countries"
                  : countries.find((c) => c.id === selectedCountry)?.name || "Select Country"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        setSelectedCountry("all");
                        setFilterOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCountry === "all" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      All Countries
                    </CommandItem>
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Basket Price
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingBasketPrice ? "Edit Basket Price" : "Add New Basket Price"}
                </DialogTitle>
                <DialogDescription>
                  {editingBasketPrice
                    ? "Update the basket price information below."
                    : "Fill in the information below to add a new basket price."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="country_id">Country *</Label>
                  <Select
                    value={formData.country_id.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country_id: parseInt(value) })
                    }
                    required
                  >
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label htmlFor="day">Date *</Label>
                  <Input
                    id="day"
                    type="date"
                    value={formData.day}
                    onChange={(e) =>
                      setFormData({ ...formData, day: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value_label_1">
                      {getLabelName("label_1")} *
                    </Label>
                    <Input
                      id="value_label_1"
                      type="number"
                      step="0.01"
                      value={formData.value_label_1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          value_label_1: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value_label_2">
                      {getLabelName("label_2")} *
                    </Label>
                    <Input
                      id="value_label_2"
                      type="number"
                      step="0.01"
                      value={formData.value_label_2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          value_label_2: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value_label_3">
                      {getLabelName("label_3")} *
                    </Label>
                    <Input
                      id="value_label_3"
                      type="number"
                      step="0.01"
                      value={formData.value_label_3}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          value_label_3: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBasketPrice ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basket Prices List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-primary">
                  <TableHead className="text-white">Country</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">{getLabelName("label_1")}</TableHead>
                  <TableHead className="text-white">{getLabelName("label_2")}</TableHead>
                  <TableHead className="text-white">{getLabelName("label_3")}</TableHead>
                  <TableHead className="text-right text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No basket prices found. Add your first basket price.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrices.map((basketPrice) => (
                    <TableRow key={basketPrice.id}>
                      <TableCell>
                        {basketPrice.country?.name || `Country #${basketPrice.country_id}`}
                      </TableCell>
                      <TableCell>
                        {new Date(basketPrice.day).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {Number(basketPrice.value_label_1).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {Number(basketPrice.value_label_2).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {Number(basketPrice.value_label_3).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(basketPrice)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(basketPrice.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Labels Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>Data Point Labels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {labels.map((label) => (
              <div key={label.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={`label-${label.id}`}>{label.label_key}</Label>
                  <Input
                    id={`label-${label.id}`}
                    value={label.name}
                    onBlur={async (e) => {
                      if (e.target.value !== label.name && e.target.value.trim() !== "") {
                        try {
                          const response = await fetch(
                            `${apiUrl}${routePrefix}/basket-price-labels/update`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                id: label.id,
                                name: e.target.value,
                              }),
                            }
                          );
                          const result = await response.json();
                          if (result.status === "success") {
                            toast.success("Label updated");
                            fetchLabels();
                          } else {
                            toast.error(result.message);
                          }
                        } catch (error) {
                          toast.error("Failed to update label");
                        }
                      }
                    }}
                  />
                </div>
                <div className="w-20">
                  <Label htmlFor={`color-${label.id}`}>Color</Label>
                  <Input
                    id={`color-${label.id}`}
                    type="color"
                    value={label.color || "#2563eb"}
                    onChange={async (e) => {
                      try {
                        const response = await fetch(
                          `${apiUrl}${routePrefix}/basket-price-labels/update`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              id: label.id,
                              color: e.target.value,
                            }),
                          }
                        );
                        const result = await response.json();
                        if (result.status === "success") {
                          toast.success("Label color updated");
                          fetchLabels();
                        }
                      } catch (error) {
                        toast.error("Failed to update label color");
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
