import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import { Plus, Edit, Trash2, Check } from "lucide-react";
import {
  CaretSortIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    wordpressPluginBoilerplateAdmin?: {
      apiUrl?: string;
      routePrefix?: string;
    };
  }
}

interface Country {
  id?: number;
  name: string;
  code?: string;
  display_order: number;
  is_active: boolean | number;
}

export default function CountriesPage() {
  const wpData = window.wordpressPluginBoilerplate || {};
  const apiUrl = wpData.apiUrl || "";
  const routePrefix = wpData.routePrefix || "african-energy-reports-plugin/v1";

  const [countries, setCountries] = useState<Country[]>([]);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [formData, setFormData] = useState<Country>({
    name: "",
    code: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    filterCountries();
  }, [statusFilter, allCountries]);

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        `${apiUrl}${routePrefix}/countries/get?active_only=false&orderby=display_order&order=asc`
      );
      if (response.ok) {
        const data = await response.json();
        setAllCountries(data || []);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  const filterCountries = () => {
    let filtered = [...allCountries];
    
    if (statusFilter === "active") {
      filtered = filtered.filter((country) => country.is_active === 1);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((country) => country.is_active === 0);
    }
    // If "all", show all countries (no filtering)
    
    setCountries(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = editingCountry
        ? `${apiUrl}${routePrefix}/countries/update`
        : `${apiUrl}${routePrefix}/countries/create`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: editingCountry?.id,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success(result.message);
        setIsDialogOpen(false);
        resetForm();
        fetchCountries();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save country");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this country?")) return;

    try {
      const response = await fetch(
        `${apiUrl}${routePrefix}/countries/delete`,
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
        fetchCountries();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete country");
    }
  };

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setFormData(country);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      display_order: 0,
      is_active: true,
    });
    setEditingCountry(null);
  };

  const openDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="hidden dark:bg-gray-900 flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={filterOpen}
                className="w-[200px] justify-between"
              >
                {statusFilter === "all"
                  ? "All Countries"
                  : statusFilter === "active"
                  ? "Active Only"
                  : "Inactive Only"}
                 <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search filter..." />
                <CommandList>
                  <CommandEmpty>No filter found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        setStatusFilter("all");
                        setFilterOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          statusFilter === "all" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      All Countries
                    </CommandItem>
                    <CommandItem
                      value="active"
                      onSelect={() => {
                        setStatusFilter("active");
                        setFilterOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          statusFilter === "active" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Active Only
                    </CommandItem>
                    <CommandItem
                      value="inactive"
                      onSelect={() => {
                        setStatusFilter("inactive");
                        setFilterOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          statusFilter === "inactive" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Inactive Only
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Countries</h2>
        <div className="flex items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Country
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCountry ? "Edit Country" : "Add New Country"}
              </DialogTitle>
              <DialogDescription>
                {editingCountry
                  ? "Update the country information below."
                  : "Fill in the information below to add a new country."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Nigeria"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code (ISO)</Label>
                <Input
                  id="code"
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="e.g., NGA"
                  maxLength={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCountry ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Countries List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Code</TableHead>
                  <TableHead className="text-white">Display Order</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-right text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No countries found. Add your first country.
                    </TableCell>
                  </TableRow>
                ) : (
                  countries.map((country) => (
                    <TableRow key={country.id}>
                      <TableCell>{country.name}</TableCell>
                      <TableCell>{country.code || "-"}</TableCell>
                      <TableCell>{country.display_order}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            country.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {country.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(country)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(country.id!)}
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
    </div>
    </div>
    </>
  );
}

