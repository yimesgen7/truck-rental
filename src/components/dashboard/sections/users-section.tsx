import { RowActions } from "@/components/dashboard/row-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardData } from "@/lib/dashboard-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

export function UsersSection({
  users,
}: {
  users: DashboardData["users"];
}) {
  return (
    <Card className="border-zinc-800 bg-zinc-900 ring-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">User management</CardTitle>
        <CardDescription>
          Manage registered accounts and roles.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto px-0 pb-0">
        {users.length === 0 ? (
          <p className="px-4 pb-4 text-sm text-zinc-500">No users found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-400">Email</TableHead>
                <TableHead className="text-zinc-400">Role</TableHead>
                <TableHead className="text-zinc-400">Bookings</TableHead>
                <TableHead className="text-zinc-400">Joined</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-zinc-800 hover:bg-zinc-950/50"
                >
                  <TableCell className="font-medium text-white">
                    {user.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-zinc-400">{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={
                        user.role === "ADMIN"
                          ? "rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400"
                          : "rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400"
                      }
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {user.bookingsCount}
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <RowActions label={user.email} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
