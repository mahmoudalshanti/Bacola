"use client";
import * as React from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";

export function DrawerDialog({
  open,
  setOpen,
  content,
  fullWidth = false,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  content: React.ReactNode;
  fullWidth?: boolean;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTitle></DialogTitle>

          <DialogContent
            className={`${
              fullWidth ? "sm:max-w-[700px]" : "sm:max-w-[550px]"
            } `}
          >
            {content}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DialogTitle></DialogTitle>
        <div>{content}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
