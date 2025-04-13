import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

function TotalRevenue({ total_revenue }: { total_revenue: number }) {
  return (
    <Card className="w-full max-w-sm p-4 mb-2">
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <DollarSign className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-lg font-bold">{total_revenue}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TotalRevenue;
