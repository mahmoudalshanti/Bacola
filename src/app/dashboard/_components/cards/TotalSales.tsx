import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

function TotalSales({ total_sales }: { total_sales: number }) {
  return (
    <Card className="w-full max-w-sm p-4">
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <ShoppingCart className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-lg font-bold">{total_sales}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TotalSales;
