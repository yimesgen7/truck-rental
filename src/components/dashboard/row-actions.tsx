"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RowActionsProps = {
  label: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function RowActions({
  label,
  onView,
  onEdit,
  onDelete,
}: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-zinc-400 hover:text-white"
        >
          <MoreHorizontal size={16} />
          <span className="sr-only">Actions for {label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-zinc-800 bg-zinc-900 text-white"
      >
        <DropdownMenuLabel className="text-zinc-400">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem
          className="focus:bg-zinc-800 focus:text-white"
          onClick={onView}
        >
          View details
        </DropdownMenuItem>
        <DropdownMenuItem
          className="focus:bg-zinc-800 focus:text-white"
          onClick={onEdit}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="focus:bg-red-500/20 focus:text-red-400"
          onClick={onDelete}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
