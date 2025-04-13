import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function UsersCard({ users }: { users: number }) {
  return (
    <Card className="w-full max-w-sm p-4 mb-2 md:mb-0">
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Users className="w-6 h-6 text-emerald-500" />
          <div>
            <p className="text-sm text-muted-foreground">Users</p>
            <p className="text-lg font-bold">{users}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
