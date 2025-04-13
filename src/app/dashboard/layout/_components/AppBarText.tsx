"use client";
import { DrawerDialog } from "@/components/Drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { actionUpdateAppbarText } from "../../_actions/actionDashboard";

function AppBarText({ textAppbar }: { textAppbar: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [text, setext] = useState<string>(textAppbar);

  const handelUpdateAppbarText = async () => {
    try {
      setLoading(true);
      const data = await actionUpdateAppbarText(text);
      if (
        typeof data === "object" &&
        data !== null &&
        "errMsg" in data &&
        data.errMsg
      ) {
        throw new Error(data.errMsg);
      }
    } catch (err) {
      console.error("Something went Error!", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="bg-blue-900 text-white py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>{text}</span>
          <button
            disabled={loading}
            onClick={() => setOpen(true)}
            className="text-sm bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
          >
            {loading ? " Editing.." : " Edit"}
          </button>
        </div>
      </div>

      <DrawerDialog
        open={open}
        setOpen={setOpen}
        content={
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="text" className="text-right">
                  Text
                </Label>
                <Input
                  id="text"
                  value={text}
                  onChange={(e) => setext(e.target.value)}
                  className="col-span-3"
                  placeholder="Make special text show in top bar"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button disabled={loading} onClick={handelUpdateAppbarText}>
                {loading ? " Saving.." : "Save"}
              </Button>
            </div>
          </>
        }
      />
    </div>
  );
}

export default AppBarText;
