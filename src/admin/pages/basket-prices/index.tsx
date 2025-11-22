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
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";

declare global {
  interface Window {
    wordpressPluginBoilerplateAdmin?: {
      apiUrl?: string;
    };
  }
}

interface BasketPrice {
  id?: number;
  day: string;
  setScore: number;
}

const wpData = window.wordpressPluginBoilerplate || {};
const apiUrl = wpData.apiUrl;
const routePrefix = wpData.routePrefix;


export default function BasketPricesPage() {
  const [basketPrices, setBasketPrices] = useState<BasketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBasketPrice, setEditingBasketPrice] = useState<BasketPrice | null>(null);
  const [formData, setFormData] = useState<BasketPrice>({
    day: "",
    setScore: 0,
  });

  useEffect(() => {
    fetchBasketPrices();
  }, []);

  const fetchBasketPrices = async () => {
    try {
      const response = await fetch(
        `${apiUrl}${routePrefix}/basket-prices/get?orderby=day&order=desc`
      );
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
      const apiUrl = wpData.apiUrl || "";
      const routePrefix = wpData.routePrefix || "wordpress-plugin-boilerplate/v1";
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
      const routePrefix = wpData.routePrefix || "wordpress-plugin-boilerplate/v1";
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
      day: "",
      setScore: 0,
    });
    setEditingBasketPrice(null);
  };

  const openDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Basket Prices</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Basket Price
            </Button>
          </DialogTrigger>
          <DialogContent>
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
                <Label htmlFor="day">Date</Label>
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
              <div className="space-y-2">
                <Label htmlFor="setScore">Price (setScore)</Label>
                <Input
                  id="setScore"
                  type="number"
                  step="0.01"
                  value={formData.setScore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      setScore: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
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
                  {editingBasketPrice ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Price (setScore)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {basketPrices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No basket prices found. Add your first basket price.
                    </TableCell>
                  </TableRow>
                ) : (
                  basketPrices.map((basketPrice) => (
                    <TableRow key={basketPrice.id}>
                      <TableCell>
                        {new Date(basketPrice.day).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${Number(basketPrice.setScore).toFixed(2)}</TableCell>
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
    </div>
  );
}

