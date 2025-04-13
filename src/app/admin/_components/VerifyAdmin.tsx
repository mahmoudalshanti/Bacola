"use client";

import { useState } from "react";
import VerifyAdminCode from "./VerifyAdminCode";
import VerifyAdminEmail from "./VerifyAdminEmail";

function VerifyAdmin() {
  const [success, setSuccess] = useState<boolean>(false);

  return (
    <>
      {success ? (
        <VerifyAdminCode />
      ) : (
        <VerifyAdminEmail setSuccess={setSuccess} />
      )}
    </>
  );
}

export default VerifyAdmin;
