"use client";

import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import { KeyboardEvent, useRef, useState } from "react";
import { actionAddManager } from "../../_actions/actionDashboard";
import Loading from "@/components/Loading";
import { Plus } from "lucide-react";

function AddManager({
  supervisor,
}: {
  supervisor: { email: string | null; id: string | null; role: string | null };
}) {
  const [email, setEmail] = useState<string>(supervisor?.email || "");
  const [errMsg, setErrMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Refs to access the email input directly
  const emailRef = useRef<HTMLInputElement>(null);

  const handelAddManager = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await actionAddManager(email);
      setEmail("");
      if (emailRef.current) {
        emailRef.current.value = "";
      }

      if (data && "errMsg" in data && data.errMsg) {
        throw new Error(data.errMsg);
      } else {
        setErrMsg("");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      setErrMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handelOnKeyDownAdd = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") handelAddManager();
  };

  return (
    <div className="mb-3">
      <p className="text-slate-800  font-semibold">
        Add new <span className="text-slate-900 font-bold">Manager</span> email
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
        <Input
          ref={emailRef}
          placeholder="Email"
          className="w-full"
          onKeyDown={handelOnKeyDownAdd}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          className="w-full sm:w-32"
          disabled={loading || !email.length || supervisor.email === email}
          onClick={handelAddManager}
        >
          {loading ? (
            <Loading />
          ) : (
            <p className="flex items-center">
              <Plus className="mr-1 size-4 " />
              Add
            </p>
          )}
        </Button>
      </div>
      {errMsg && (
        <p className="text-red-500 font-semibold text-sm">{errMsg}.</p>
      )}
    </div>
  );
}

export default AddManager;
