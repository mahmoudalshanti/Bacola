import { Card, CardContent } from "@/components/ui/card";
import { Boxes } from "lucide-react";

export default function CategoriesCard({ categories }: { categories: number }) {
  return (
    <Card className="w-full max-w-sm p-4 mb-2 md:mb-0">
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Boxes className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="text-lg font-bold">{categories}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
