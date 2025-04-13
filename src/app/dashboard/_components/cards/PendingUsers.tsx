import { Card, CardContent } from "@/components/ui/card";
import { StopCircle } from "lucide-react";

function PendingUsers({ pendingUsers }: { pendingUsers: number }) {
  return (
    <Card className="w-full max-w-sm p-4">
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <StopCircle className="w-6 h-6 text-orange-500" />
          <div>
            <p className="text-sm text-muted-foreground">Pending- Users</p>
            <p className="text-lg font-bold">{pendingUsers}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PendingUsers;
