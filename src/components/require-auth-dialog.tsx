"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RequireAuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RequireAuthDialog({
  open,
  onOpenChange,
}: RequireAuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            Sign up to continue
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create a free account to book or rent a truck. Already have an
            account? Log in instead.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 border-zinc-800 bg-transparent sm:flex-col">
          <Button
            asChild
            className="w-full bg-orange-500 text-white hover:bg-orange-600"
          >
            <Link href="/register" onClick={() => onOpenChange(false)}>
              Register
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
          >
            <Link href="/login" onClick={() => onOpenChange(false)}>
              Log in
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
