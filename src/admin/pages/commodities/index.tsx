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
    wordpressPluginBoilerplate?: {
      apiUrl?: string;
      routePrefix?: string;
    };
  }
}

interface Commodity {
  id?: number;
  name: string;
  abbreviation: string;
  prevPrice: number;
  curPrice: number;
}

export default function CommoditiesPage() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCommodity, setEditingCommodity] = useState<Commodity | null>(null);
  const [formData, setFormData] = useState<Commodity>({
    name: "",
    abbreviation: "",
    prevPrice: 0,
    curPrice: 0,
  });

  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      const wpData = window.wordpressPluginBoilerplate || {};
      const apiUrl = wpData.apiUrl;
      const routePrefix = wpData.routePrefix;
      // const routePrefix = wpData.route_prefix || "wordpress-plugin-boilerplate/v1";
      const response = await fetch(
        `${apiUrl}${routePrefix}/commodities/get`
      );
      if (response.ok) {
        const data = await response.json();
        setCommodities(data || []);
      }
    } catch (error) {
      console.error("Error fetching commodities:", error);
      toast.error("Failed to fetch commodities");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const wpData = window.wordpressPluginBoilerplate || {};
      const apiUrl = wpData.apiUrl;
      const routePrefix = wpData.routePrefix;
      const endpoint = editingCommodity
        ? `${apiUrl}${routePrefix}/commodities/update`
        : `${apiUrl}${routePrefix}/commodities/create`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: editingCommodity?.id,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success(result.message);
        setIsDialogOpen(false);
        resetForm();
        fetchCommodities();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save commodity");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this commodity?")) return;

    try {
      const wpData = window.wordpressPluginBoilerplateAdmin || {};
      const apiUrl = wpData.apiUrl || "";
      const routePrefix =  "wordpress-plugin-boilerplate/v1";
      const response = await fetch(
        `${apiUrl}${routePrefix}/commodities/delete`,
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
        fetchCommodities();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete commodity");
    }
  };

  const handleEdit = (commodity: Commodity) => {
    setEditingCommodity(commodity);
    setFormData(commodity);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      abbreviation: "",
      prevPrice: 0,
      curPrice: 0,
    });
    setEditingCommodity(null);
  };

  const openDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Commodities</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Commodity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCommodity ? "Edit Commodity" : "Add New Commodity"}
              </DialogTitle>
              <DialogDescription>
                {editingCommodity
                  ? "Update the commodity information below."
                  : "Fill in the information below to add a new commodity."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abbreviation">Abbreviation</Label>
                <Input
                  id="abbreviation"
                  value={formData.abbreviation}
                  onChange={(e) =>
                    setFormData({ ...formData, abbreviation: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prevPrice">Previous Price</Label>
                <Input
                  id="prevPrice"
                  type="number"
                  step="0.01"
                  value={formData.prevPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prevPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="curPrice">Current Price</Label>
                <Input
                  id="curPrice"
                  type="number"
                  step="0.01"
                  value={formData.curPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      curPrice: parseFloat(e.target.value) || 0,
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
                  {editingCommodity ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commodities List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Abbreviation</TableHead>
                  <TableHead>Previous Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commodities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No commodities found. Add your first commodity.
                    </TableCell>
                  </TableRow>
                ) : (
                  commodities.map((commodity) => (
                    <TableRow key={commodity.id}>
                      <TableCell>{commodity.name}</TableCell>
                      <TableCell>{commodity.abbreviation}</TableCell>
                      <TableCell>₦{commodity.prevPrice}</TableCell>
                      <TableCell>₦{commodity.curPrice}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(commodity)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(commodity.id!)}
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

