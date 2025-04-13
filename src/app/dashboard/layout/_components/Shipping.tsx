"use client";
import { DrawerDialog } from "@/components/Drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { actionUpdateShipping } from "../../_actions/actionDashboard";

function Shipping({ shipping }: { shipping: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [shippingInfo, setShippingInfo] = useState<string>(shipping || "");

  const handleUpdateShippingInfo = async () => {
    try {
      setLoading(true);
      await actionUpdateShipping(Number(shippingInfo));
      setOpen(false);
    } catch (err) {
      console.error("Something went Error!", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-cyan-800 text-white py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="truncate max-w-[80%]">
            Shipping: {shippingInfo}$
          </span>
          <button
            disabled={loading}
            onClick={() => setOpen(true)}
            className="text-sm bg-cyan-500 hover:bg-cyan-600 px-2 py-1 rounded"
          >
            {loading ? " Editing.." : " Edit"}
          </button>
        </div>
      </div>

      <DrawerDialog
        open={open}
        setOpen={setOpen}
        content={
          <div className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shipping-info" className="text-right">
                  Shipping Info
                </Label>
                <Input
                  id="shipping-info"
                  value={shippingInfo}
                  onChange={(e) => setShippingInfo(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Free shipping on orders over $50"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShippingInfo(shipping);
                  setOpen(false);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateShippingInfo}
                disabled={loading || !shippingInfo.trim()}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default Shipping;
