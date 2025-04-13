import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function ProductsCard({ products }: { products: number }) {
  return (
    <Card className="w-full max-w-sm p-4">
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Package className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Products</p>
            <p className="text-lg font-bold">{products}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
