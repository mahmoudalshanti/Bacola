"use client";

import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { actionReplaceEmail } from "../../_actions/actionDashboard";
import Loading from "@/components/Loading";
import { Replace } from "lucide-react";

function ReplaceEmail({
  supervisor,
}: {
  supervisor: { email: string | null; id: string | null; role: string | null };
}) {
  const [email, setEmail] = useState<string>(supervisor?.email || "");
  const [errMsg, setErrMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handelReplaceEmail = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await actionReplaceEmail(email);

      if (data && "errMsg" in data && data.errMsg) {
        throw new Error(data.errMsg);
      } else {
        setErrMsg("");
        setLoading(false);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      setErrMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-slate-800 mt-5 font-semibold">Replace your email</p>

      <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
        <Input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          defaultValue={supervisor.email || ""}
          className="w-full"
        />

        <Button
          className="w-full sm:w-32"
          disabled={loading || !email.length || supervisor.email === email}
          onClick={handelReplaceEmail}
        >
          {loading ? (
            <Loading />
          ) : (
            <p className="flex items-center">
              <Replace className="mr-1" /> Replace{" "}
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

export default ReplaceEmail;
